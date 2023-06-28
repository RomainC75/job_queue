const puppeteer = require('puppeteer')


const getPokemonInfos = (name) =>{
    return new Promise(async (resolve, reject )=>{
        try {
            const url = `https://scrapeme.live/?s=${name}`
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
        } catch (error) {
            
        }
    })
}