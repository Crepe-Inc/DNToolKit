import embryos from "../../tools/data/AbilityPathData.json"
import embryos1 from "../../tools/data/GadgetPathData.json"

function  makeEmbryo(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = 0x83 * h + name.charCodeAt(i)
        h = h & 0xffffffff
    }

    return (new Uint32Array([h])[0]);
}

export default class EmbryoList{
    public static Embryos: Map<number,string> = new Map();
    public static init(){
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

    public static getEmbryo(id: number){
        return this.Embryos.get(id);
    }
    


}