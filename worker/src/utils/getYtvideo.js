const ytdl = require('ytdl-core')
const fs = require('fs')

async function getYtvideo (id, link, channel){
    return new Promise ( async (resolve, reject)=>{
        const outputFilePath = id;

        const infos = await ytdl.getBasicInfo(link)
        console.log('==> infos : ', infos)
        const download = ytdl(link, { filter: 'audioonly', quality: 'highest' });

        download.on('progress', (_, downloaded, total) => {
            const percent = (downloaded / total) * 100;
            console.log(`Downloaded: ${percent.toFixed(2)}%`);
            // channel.publish('ytdl-pourcent', Buffer.from(JSON.stringify({id,percent})));
        });
        download.on('end', () => {
            console.log('Download completed!');
            resolve();
        });
        download.on('error', (error) => {
            console.error('Error:', error.message);
            reject();
        });
        download.pipe(fs.createWriteStream(outputFilePath));
    })
}

module.exports ={
    getYtvideo
}