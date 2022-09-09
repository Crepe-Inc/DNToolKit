import { ProtEntityType } from "../../src/messages/ProtEntityType";
import type {SceneEntityDisappearNotify} from "../../src/messages/SceneEntityDisappearNotify";
import type {PacketNotifyDT} from "../../src/websocket/WSPacket";
import {world} from "../main";
import { Entity } from "../world/entity/Entity";

export default function handle(data: PacketNotifyDT<SceneEntityDisappearNotify>)
{
    for(let entityId of data.PacketData.EntityList){
        const entity = world.entityList.get(entityId);

        if(!entity){
            continue;   
        }
        //we rely on sceneteam to update avatar entities
        if(Entity.isAvatar(entity)){
            //todo:set the avatar to an inactive state
            continue;
        };
        //todo: set a despawn event
        //no delay for it though

        //wait a bit before deleting it
        setTimeout(() => {
            world.deregisterEntity(entityId, data.PacketData.DisappearType)
        }, 5000);
        
    }
    // console.log(`Deregistered ${data.PacketData.EntityList.length} entities`)
}