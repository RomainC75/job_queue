const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const getContainerName = () =>{
    return new Promise( async (resolve , reject)=>{
        const { stdout, stderr } = await exec('docker ps --filter "id=$(hostname)" --format "{{.Names}}"');
        if(stderr){return reject(stderr)}
        return resolve(stdout)
    })
}

module.exports=getContainerName