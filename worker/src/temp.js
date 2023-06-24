const puppeteer = require("puppeteer")
const connectToSurfsharkVPN = require('./utils/vpn')
const getContainerName = require('./utils/getContainerName')


const getInfos = () =>{
    console.log("==> running ")
    return new Promise ( async (resolve, reject) =>{
        
        const CONTAINER_NAME = await getContainerName()
        console.log( "=> PROCESS ID ", CONTAINER_NAME )
        
        await connectToSurfsharkVPN()
        await new Promise((resolve)=>setTimeout(()=>{resolve()},2000))
        try{
            const url = "https://www.speedtest.net/fr"
            const browser = await puppeteer.launch({
                headless:true,
                args: [
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                ]
            })
            const page = await browser.newPage()
            await page.goto(url,{waitUntil:'networkidle2'})
            await page.waitForSelector('.ispComponent')
            const res = await page.$eval('.ispComponent > div > .result-data',(els)=>els.textContent)
            console.log("=> res : ", res)
            await browser.close()
            resolve()
        }catch(e){
            console.log("=> error ", e)
            reject(e)
        }
    }) 
}

//172.17.0.2


getInfos()