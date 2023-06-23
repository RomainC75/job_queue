const { exec } = require('child_process');
const fsp = require('fs/promises')

const ovpnFilePath = "src/utils/ovpns/jp001.ovpn"
const passFilePath = "src/utils/ovpns/pass.txt"

const command = `openvpn --config ${ovpnFilePath} --auth-user-pass ${passFilePath}`

function connectToSurfsharkVPN() {
  return new Promise(async (resolve, reject) => {

    const workingDir = await fsp.realpath('.');
    console.log("=> pwd : ", workingDir)

    const files = await fsp.readdir('src/utils/ovpns');
    console.log("=> files : ", files)

    const stat = await fsp.stat(passFilePath)
    console.log("==> stats : ", stat)

    const stat1 = await fsp.stat(ovpnFilePath)
    console.log("==> stats : ", stat1)

    const openvpnProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('OpenVPN Error:', error);
        reject(new Error('Failed to connect to Surfshark VPN server'));
      }
    });
    
    openvpnProcess.stdout.on('data', (data) => {
      console.log("=>OUTPUT : ", data.toString());
      resolve()
    });
    
    openvpnProcess.stderr.on('data', (data) => {
      console.error('OpenVPN Error:', data.toString());
      reject(new Error('Failed to connect to Surfshark VPN server'));
    });
    
    openvpnProcess.on('close', (code) => {
      console.log('OpenVPN process exited with code', code);
      resolve();
    });
  });
}


module.exports=connectToSurfsharkVPN