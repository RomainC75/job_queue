const axios = require('axios');
const fs = require('fs');
const fsp = require("fs").promises;

const SERVER_URL = process.env.SERVER_URL

const filePath = './output.pdf'

const sendFileToServer = (id) => {
    return new Promise(async (resolve, reject)=>{
        try {

          // const fileData = fs.createReadStream(filePath);
          const fileData = new Blob([await fsp.readFile(filePath)]);
          console.log("==> ", await fsp.stat(filePath))
          const formData = new FormData();
          formData.append('file', fileData, "file.pdf");
          const response = await axios.post(`${SERVER_URL}/upload/${id}`, formData, {
            headers: formData.getHeaders
          });
          const ans = await response.data
          resolve(ans)
        } catch (error) {
          reject(error)
        }
    })
};

module.exports = {
    sendFileToServer
}