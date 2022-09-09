import type { PacketNotifyDT } from "../websocket/WSPacket";
import {handleInvoke} from "../lib/AbilityInvokeProcessor"
import { ClientAbilityChangeNotify } from "../messages/ClientAbilityChangeNotify";

export default function handle(data: PacketNotifyDT<ClientAbilityChangeNotify>) {


    handleInvoke(data.PacketData.Invokes || [], data.PacketData.EntityId);
}

    

