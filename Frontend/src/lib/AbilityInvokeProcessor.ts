import { world } from "../main";
import { AbilityActionCreateGadget } from "../messages/AbilityActionCreateGadget";
import { AbilityInvokeArgument } from "../messages/AbilityInvokeArgument";
import { AbilityInvokeEntry } from "../messages/AbilityInvokeEntry";
import { AbilityInvokeEntryHead } from "../messages/AbilityInvokeEntryHead";
import { AbilityMetaModifierChange } from "../messages/AbilityMetaModifierChange";
import { AbilityMetaModifierDurabilityChange } from "../messages/AbilityMetaModifierDurabilityChange";
import { AbilityMetaTriggerElementReaction } from "../messages/AbilityMetaTriggerElementReaction";
import { ForwardType } from "../messages/ForwardType";
import { ModifierDurability } from "../messages/ModifierDurability";
import { Entity } from "../world/entity/Entity";
import { Element } from "../packets/CombatInvocationsNotify";
import { AbilityMetaAddAbility } from "../messages/AbilityMetaAddAbility";
import EmbryoList from "./EmbryoList";
import { AbilityActionGenerateElemBall } from "../messages/AbilityActionGenerateElemBall";
import { ModifierAction } from "../messages/ModifierAction";


export function handleInvoke(data: AbilityInvokeEntry[], entityId?: number) {
    //do actual damage parsing here
    //entityfp update notify is for energy, and syncing values, not damage parsing

    //todo: figure out entityId
    for (let i of data) {
        switch (i.ArgumentType) {
            case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_ACTION_CREATE_GADGET:
                handleCreateGadget(i as Invoke<AbilityActionCreateGadget>);
                break;
            // case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_META_MODIFIER_CHANGE:
            //     handleMetaModifierChange(i as Invoke<AbilityMetaModifierChange>);
            //     break;
            case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_ACTION_GENERATE_ELEM_BALL:
                handleBalls(i as any)
                break;
            // case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_META_MODIFIER_DURABILITY_CHANGE:
            //     handleMetaModifierDurabilityChange(i as Invoke<AbilityMetaModifierDurabilityChange>);
            //     //THERES A MODIFIER DURABILITY CHANGE IN ABILITYSYNCSTATEINFO IM GOING TO CRYYYYYYYY
            //     break;
            case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_META_ADD_NEW_ABILITY:
                handleNewAbility(i as Invoke<AbilityMetaAddAbility>);
                break;
            // case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_META_TRIGGER_ELEMENT_REACTION:
            //     handleMetaTriggerElementReaction(i as any);
            //     break;
            case AbilityInvokeArgument.ABILITY_INVOKE_ARGUMENT_META_REMOVE_ABILITY:
                handleRemoveAbility(i as any);

            //additional potential candiates
            // set override param
            // ABILITY_INVOKE_ARGUMENT_ACTION_SET_RANDOM_OVERRIDE_MAP_VALUE


            default:
                //@ts-ignore
                i.ArgumentType = AbilityInvokeArgument[i.ArgumentType];
                if(i.EntityId){
                    console.log(i)
                }
        }
        if([9, 8, 5, 101].includes(i.ArgumentType)){
            console.log(i)
            console.log("SPECIAL!!!!!")
        }
    }
}
interface Invoke<T> {
    ArgumentType?: AbilityInvokeArgument;
    Head?: AbilityInvokeEntryHead;
    ForwardPeer?: number;
    EventId?: number;
    ForwardType?: ForwardType;
    AbilityData?: T;
    TotalTickTime?: number;
    EntityId?: number;
}

function handleBalls(data: Invoke<AbilityActionGenerateElemBall>){
    let responsible = world.entityList.get(data.EntityId);
    let ability = responsible?.abilities[data.Head.InstancedAbilityId]
    console.log(data)
    console.log((responsible?.getFriendlyName() || data.EntityId) + " generated a ball of with ability" + ability);

}

function handleRemoveAbility(data: Invoke<never>) {
    let responsible = world.entityList.get(data.EntityId);
    if(!responsible) return
    let name = responsible.abilities[data.Head.InstancedAbilityId]
    console.log((responsible?.getFriendlyName() || data.EntityId) + " removed an ability: " + name);
    responsible.removeEmbryo(data.Head.InstancedAbilityId);

}

function handleNewAbility(data: Invoke<AbilityMetaAddAbility>) {
    //get entity
    let responsible = world.entityList.get(data.EntityId);
    if (!responsible) return
    const hash = data.AbilityData.Ability.AbilityName.Hash;
    responsible.addEmbryo({
        AbilityId: data.AbilityData.Ability.InstancedAbilityId,
        AbilityNameHash: hash,
    })

}


function handleCreateGadget(data: Invoke<AbilityActionCreateGadget>) {
    let responsible = world.entityList.get(data.EntityId);
    console.log((responsible?.getFriendlyName() || data.EntityId) + " created a gadget");

}

function handleMetaTriggerElementReaction(data: Invoke<AbilityMetaTriggerElementReaction>) {
    return;
    let responsible = world.entityList.get(data.AbilityData.TriggerEntityId || data.EntityId);
    let readable = {
        ReactionType: ElementReactionType[data.AbilityData.ElementReactionType],
        ElementSourceType: Element[data.AbilityData.ElementSourceType],
        ElementReactorType: Element[data.AbilityData.ElementReactorType],
        HitIndex: data.AbilityData.HitIndex,
    }
    console.log((responsible?.getFriendlyName() || data.EntityId) + " triggered a reaction: " + JSON.stringify(readable));

}

function handleMetaModifierChange(data: Invoke<AbilityMetaModifierChange>) {
    /**
     * Modifier Local id is unfortunately not unique, so we need to use the instanced modifier id
     * to distinguish between modifiers
     * intstanced abilityid is used to figure out what ability the modifier belongs to
     * (as well as parent ability name)
     * if modifierdurability.reduceratio > 0, then it is slowly ticking down
     * exist duration is the total duration of the modifier so far(not sure if onfield or total) looks like total for now
     */
    let responsible = world.entityList.get(data.EntityId);
    if (!responsible) {
        return;
    }
    if (!Entity.isAvatar(responsible)) return;
    if(data.Head.InstancedModifierId == 0){
        console.log("modifier id is 0")
        console.log(data)
        // return
    }
    switch(data.AbilityData.Action){
        case ModifierAction.MODIFIER_ACTION_ADDED:
            responsible.MetaModifiers[data.Head.InstancedModifierId] = {
                localId: data.AbilityData.ModifierLocalId,
                source: data.Head.TargetId == 0 ? data.EntityId: data.Head.TargetId,
                properties: data.AbilityData.Properties.map(x=>x.Key.Hash = EmbryoList[x.Key.Hash] || x.Key.Hash)
            };
            console.log(responsible.MetaModifiers)

            break;
        case ModifierAction.MODIFIER_ACTION_REMOVED:
            delete responsible.MetaModifiers[data.Head.InstancedModifierId];

            break;
        default:
            break;

    }

}


function handleMetaModifierDurabilityChange(data: Invoke<AbilityMetaModifierDurabilityChange>) {

    return;
    let responsible = world.entityList.get(data.EntityId);

    if (!responsible) {
        return;
    }
    
    let abilityName = responsible.abilities[data.Head.InstancedAbilityId];
    //somehow figure out abilityName and how to relate it to the ElementType;
    let timeLeft = data.AbilityData.RemainDurability / data.AbilityData.ReduceDurability;
    
    //ModifierConfigLocalId and InstancedModifierId are set, nothing else is
    // console.log(data.Head)
    //reduce durability == decay rate/second
    //remain durability == current durability

    // console.log((responsible?.getFriendlyName() || data.EntityId) + " applied an element " + JSON.stringify(data.AbilityData));
    //time left = remain durability / reduce durability

}

export enum ElementReactionType {
    None = 0,
    Explode = 1,
    Stream = 2,
    Burning = 3,
    Burned = 4,
    Wet = 5,
    Overgrow = 6,
    Melt = 7,
    Freeze = 8,
    AntiFire = 9,
    Rock = 10,
    SlowDown = 11,
    Shock = 12,
    Wind = 13,
    Electric = 14,
    Fire = 15,
    Superconductor = 16,
    SwirlFire = 17,
    SwirlWater = 18,
    SwirlElectric = 19,
    SwirlIce = 20,
    SwirlFireAccu = 21,
    SwirlWaterAccu = 22,
    SwirlElectricAccu = 23,
    SwirlIceAccu = 24,
    StickRock = 25,
    StickWater = 26,
    CrystallizeFire = 27,
    CrystallizeWater = 28,
    CrystallizeElectric = 29,
    CrystallizeIce = 30,
    FrozenBroken = 31,
    StickGrass = 32,
    Overdose = 33,
    OverdoseElectric = 34,
    OverdoseGrass = 35,
    OvergrowMushroomFire = 36,
    OvergrowMushroomElectric = 37,
}


export function logModifiers() {
}