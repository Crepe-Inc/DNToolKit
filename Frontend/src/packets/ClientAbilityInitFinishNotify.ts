
import type { PacketNotifyDT } from "../websocket/WSPacket";
import {handleInvoke} from "../lib/AbilityInvokeProcessor"
import { ClientAbilityInitFinishNotify } from "../messages/ClientAbilityInitFinishNotify";

export default function handle(data: PacketNotifyDT<ClientAbilityInitFinishNotify>) {

    handleInvoke(data.PacketData.Invokes || [], data.PacketData.EntityId);
}

    

