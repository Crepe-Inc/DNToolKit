import type {SceneTeamUpdateNotify} from "src/messages/SceneTeamUpdateNotify";
import type {PacketNotifyDT} from "src/websocket/WSPacket";
import {Entity} from "../world/entity/Entity";
import {VisionType} from "../messages/VisionType";
import {world} from "../main";
import {ProtEntityType} from "../messages/ProtEntityType";

export default function handle(data: PacketNotifyDT<SceneTeamUpdateNotify>) {
    let newAvatars: Record<number, Entity>  = {};

    let a: string[] = [];
    //add new avatars
    for(let ent of data.PacketData.SceneTeamAvatarList)
    {
        //for some reason server first sends us a reply without the entity ids filled, so we have to ignore default value
        if (ent.SceneEntityInfo.EntityId != 0)
        {
            if (!world.entityList.has(ent.EntityId))
            {
                const newAvt = Entity.fromSceneEntity(ent.SceneEntityInfo)
                ent.AbilityControlBlock.AbilityEmbryoList.forEach(embryo => {
                    newAvt.addEmbryo(embryo);
                })
                world.registerEntity(newAvt, VisionType.VISION_TYPE_BORN);
                a.push(newAvt.getFriendlyName());
            }
            newAvatars[ent.EntityId] =  world.entityList.get(ent.EntityId);
        }
    }

    //remove any old avatars
    for(let [entityID, entity] of world.entityList.entries()){
        if(entity.EntityType == ProtEntityType.PROT_ENTITY_TYPE_AVATAR){
            if(!Object.keys(newAvatars).includes(entityID.toString())){
                console.log(`Removing avatar ${entityID}- ${entity.getFriendlyName()}`)
                world.deregisterEntity(entityID, VisionType.VISION_TYPE_REMOVE)
            }
        }
    }
    if(!world.entityList.get(327155713)){
        world.entityList.set(327155713, Entity.fromMPLevelEntityInfo({
            EntityId: 327155713,
            AuthorityPeerId: 1
        }))
    }
    if(Object.values(newAvatars).length > 0)
        console.log(`New Team! ${Object.values(newAvatars).map(e => e.getFriendlyName()).join(", ")} - ${a.join(", ")} spawned`)

}