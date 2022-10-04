const fs = require("fs")
const bf = JSON.parse(fs.readFileSync("./EmbryoList.json", "utf8"))
const real = JSON.parse(fs.readFileSync("./embryos.json", "utf8"))

const bfvals = Object.values(bf)
Object.values(real).forEach((embryo, index) => {
   embryo.forEach((name) => {
    if(!bfvals.includes(name)) {
        console.log(name)
    }
   })
})

// embryo.forEach((item, index) => {
//     if(!bf[item]){
//         console.log(item)
//     }
// })