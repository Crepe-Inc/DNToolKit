
import type { AbilityChangeNotify } from "../messages/AbilityChangeNotify";
import type { PacketNotifyDT } from "../websocket/WSPacket";
import {handleInvoke} from "../lib/AbilityInvokeProcessor"
import { world } from "../main";

export default function handle(data: PacketNotifyDT<AbilityChangeNotify>) {
    //do actual damage parsing here
    //entityfp update notify is for energy, and syncing values, not damage parsing

    const ent = world.entityList.get(data.PacketData.EntityId)
    if(ent){
        data.PacketData.AbilityControlBlock.AbilityEmbryoList.forEach(x=>{
            ent.addEmbryo(x)
        })
    }
}