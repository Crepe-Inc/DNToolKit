import Long from "long";
import { time } from "../main";
import type { PacketNotifyData } from "../websocket/WSPacket";

export default class PacketList{
    private packetList = new Array<PacketNotifyData>()

    private latestMS: Long = Long.fromValue(0);

    public onAddPackets: (newPackets:Array<PacketNotifyData>)=>void;

    addPackets(packets: Array<PacketNotifyData>){
        // merge packets and packet List based on PacketHead.SentMs
        
        // look into benchmarking a merge sort type thing vs this
        // merge sort has less comparisons but more memory usage with each new array so idk
        
        // im honestly not quite sure we need to do this sort *that* badly?
        // look into checking if all the incoming packets are in order
        // monitor this performance wise bc if this becomes a problem i'll have to figure something else out

        packets.forEach(pkt => {
            time.setTime(Long.fromValue(pkt.PacketHead.SentMs).toNumber())   
            //packetlist.concat should work but i want to update the "time" variable
            this.packetList.push(pkt); 
        })

        //theres a few packets without packethead

        if(this.onAddPackets){
            this.onAddPackets(packets);
        }
    }

    public getPackets(){
        return this.packetList;
    }

    public longMSsort = (a:PacketNotifyData, b) => {

            
        // this might honestly work better
        return Long.fromValue(a.PacketHead.SentMs).subtract(Long.fromValue(b.PacketHead.SentMs)).isNegative() ? -1 : 1;;

        // if(Long.fromValue(a.PacketHead.SentMs).greaterThan(Long.fromValue(b.PacketHead.SentMs))){
        //     return 1;
        // }else if(a.PacketHead.SentMs.lessThan(b.PacketHead.SentMs)){
        //     return -1;
        // }else{
        //     return 0;
        // }
    }
    
}