
import type { AbilityInvocationsNotify } from "../messages/AbilityInvocationsNotify";
import type { PacketNotifyDT } from "../websocket/WSPacket";
import {handleInvoke} from "../lib/AbilityInvokeProcessor"

export default function handle(data: PacketNotifyDT<AbilityInvocationsNotify>) {
    //do actual damage parsing here
    //entityfp update notify is for energy, and syncing values, not damage parsing

    handleInvoke(data.PacketData.Invokes || []);
}

    

