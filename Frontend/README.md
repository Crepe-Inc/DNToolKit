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

const file = fs.readFileSync("./log.dntkap").toString("utf-8");

const pkts = file.split("█▄█\n")
console.log("found " + pkts.length + " packets");

const out = pkts.map((pkt) => {
    const strdata = Buffer.from(pkt, "base64").toString("utf-8");
    const jsonData = JSON.parse(strdata);
    /*

    {
        time: 000 //SentMs from server/client
        sender: 1 //1 for Client, 0 for Server
        data: {} //object with packet data
        cmd: "EntityFightPropNotify" //name of packet
    }
    */
    jsonData.data = {
        "lolNo": "replaced for privacy"
    }
    return jsonData;
});


console.log(out);
```

If yall need packet type interfaces , dm me or something i'll see what i can do



If you're using c# you can probably just use net6.0/Common.dll as a dependency

If you're using anything else you dm me and i'll see if i can generate it (should be fun ;-;)

You should be able to extrapolate your own types from the dump though so hopefully thats enough?


DM me for more stuff ig? (LostTree#4398)

I'm in KQM so you shouldnt need to friend me in order to message me


