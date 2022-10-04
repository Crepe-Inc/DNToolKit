const embryos = require("./Frontend/tools/data/AbilityPathData.json")
const embryos1 = require("./Frontend/tools/data/GadgetPathData.json")
const fs = require("fs")

function  makeEmbryo(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = 0x83 * h + name.charCodeAt(i)
        h = h & 0xffffffff
    }

    return (new Uint32Array([h])[0]);
}

class EmbryoList{
    Embryos = new Map();
    init(){
        let keys = Object.keys(embryos.abilityPaths);
        for(let key of keys){
            let embs = embryos.abilityPaths[key];
            for(let emb of embs){
                this.Embryos.set(makeEmbryo(emb),emb);
            }
        }
        keys = Object.keys(embryos1.gadgetPaths);
        for(let key of keys){
            let embs = embryos1.gadgetPaths[key];
            for(let emb of embs){
                this.Embryos.set(makeEmbryo(emb),emb);
            }
        }
    }

    getEmbryo(id){
        return this.Embryos.get(id);
    }
    dump(){
        //write to obj
        let obj  = {};
        for(let [key,value] of this.Embryos){
            obj[key] = value;
        }

        fs.writeFileSync("./EmbryoList.json",JSON.stringify(obj));
    }

}

// let a = new EmbryoList();
// a.init();
// a.dump();

console.log(makeEmbryo("Animator_MoveSpeedRatio"))