const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const fsp = require('fs/promises')

const getContainerName = () =>{
    return new Promise( async (resolve , reject)=>{
        const { stdout, stderr } = await exec('docker ps --filter "id=$(hostname)" --format "{{.Names}}"');
        if(stderr){return reject(stderr)}
        return resolve(stdout)
    })
}

const getContainerNumber = async () =>{
    try {
        const fullName = await getContainerName()
        console.log("=> fullName : ", fullName)
        const res = fullName.trim().match(/[0-9]+/)
        console.log("==> res : ", res)
        if(res){
            return parseInt(res[0])
        }
    } catch (error) {
        return 1
    }
}

const getOvpnFilename = async () =>{
    const files = await fsp.readdir('src/utils/ovpns')
    console.log("=> files ovpns : ", files)
    const containerNumber = await getContainerNumber()
    return files.filter(filename=>filename.match(/\.ovpn$/))[containerNumber-1]
}

module.exports={
    getContainerNumber, 
    getOvpnFilename
}