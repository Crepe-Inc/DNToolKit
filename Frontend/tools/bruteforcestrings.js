const fs = require("fs");

const set = new Set();
function processFile(path){
    // Read the file
    const data = fs.readFileSync(path);
    let pos = 0;
    while(true){
        //read byte
        const byte = data.readUInt8(pos);
        //read byte len
        const str = data.subarray(pos+1, pos + byte+1).toString();
        //if str only has a-zA-Z0-9_ then it is a string
        if(str.match(/^[a-zA-Z0-9_]+$/)){
            //has to begin with A-Z
            if(str.match(/^[A-Z]/)){
                set.add(str);
            }
        }else{
           // console.log("Not a string: "+ str);
        }
        pos += 1;
        if(pos == data.length){
            //console.log("End of file");
            break;
        }
    }

}
function makeEmbryo(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = 0x83 * h + name.charCodeAt(i)
        h = h & 0xffffffff
    }

    return (new Uint32Array([h])[0]);
}
fs.readdirSync("../../binbinbinbin/MiHoYoBinData").forEach(file => {
    processFile("../../binbinbinbin/MiHoYoBinData"+file);
});
const obj = {}
set.forEach(str => {
    obj[makeEmbryo(str)] = str;
});
fs.writeFileSync("embryos.json", JSON.stringify(obj, null, 4));