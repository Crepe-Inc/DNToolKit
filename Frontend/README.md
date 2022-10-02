# DNTK frontend


## Types
Only the below used types and their dependencies were added to the repo.


```
AbilityInvocationsNotify
AbilityInvokeArgument
AbilityActionCreateGadget
AbilityInvokeEntry
AbilityMetaModifierChange
EntityMoveInfo
EvtBeingHitInfo
CombatInvocationsNotify
CombatTypeArgument
ProtEntityType
EntityFightPropNotify
EntityFightPropUpdateNotify
EvtCreateGadgetNotify
EvtDestroyGadgetNotify
PlayerEnterSceneInfoNotify
SceneEntityAppearNotify
SceneEntityDisappearNotify
SceneTeamUpdateNotify
VisionType
UnionCmdNotify
PacketHead
```

These were generated with a slightly modified version of ts-proto 
due to c#'s protoc only generating in PascalCase, 
unlike ts-proto's options of camelCase or snake_case.


## *.dntkap files

They should be pretty easily parsed as:
```js
const fs = require("fs");
const JSONBI = require("json-bigint")
const file = fs.readFileSync("./log.dntkap").toString("utf-8");

const pkts = file.split("█▄█\n")
console.log("found " + pkts.length + " packets");

const out = pkts.map((pkt) => {
    const strdata = Buffer.from(pkt, "base64").toString("utf-8");
    /*

    {
        PacketHead: {
            SentMs: 000 //time
        } //SentMs from server/client
        Sender: 1 //1 for Client, 0 for Server
        PacketData: {} //object with packet data
        CmdID: "packetnamehurrdurr" //name of packet
    }
    */
    //if you need to parse these into js objects
    //use json-bigint the lib
    return JSONBI.parse(strdata);
});


console.log(out);
```

If yall need packet type interfaces , dm me or something i'll see what i can do



If you're using c# you can probably just use net6.0/Common.dll as a dependency

If you're using anything else you dm me and i'll see if i can generate it (should be fun ;-;)

You should be able to extrapolate your own types from the dump though so hopefully thats enough?


DM me for more stuff ig? (LostTree#4398)

I'm in KQM so you shouldnt need to friend me in order to message me


