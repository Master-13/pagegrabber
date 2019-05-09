const puppeteer = require('puppeteer');
const ipInt = require('ip-to-int');
const fs = require('fs');

const bigScreen = {width: 1280, height: 720};
const smallScreen= {width: 400, height: 800};
const mobileChromeUA='Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
const windowsChromeUA='Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36';

var ip=ipInt('52.94.80.0').toInt();
const maxip=ipInt('18.189.95.255').toInt();

for(let i=0; i<15; i+=1){   //启动10个浏览器试试
  (async () => {
    let browser = await puppeteer.launch({
      // headless: false,
      ignoreHTTPSErrors: true
    });
    let browserid=i;
    console.log(`Browser ${i} start.`);
    let page = await browser.newPage();
    while(true){
      // ip+=1;
      // if(ip==maxip)
      //   break;
      // let thisip=ipInt(ip).toIP();
      let thisip=ipInt(Math.floor(Math.random()*maxip)).toIP();
      console.log(`Browser ${i}: ${thisip}`);
      // ip+=1;
      // 先获取PC
      await page.setViewport(bigScreen);
      await page.setUserAgent(windowsChromeUA);
      try {
        await page.goto(`http://${thisip}`, {waitUntil: ['domcontentloaded','networkidle0']});
        await page.screenshot({
          path: `screenshots/${thisip}_PC.jpg`,
          type: 'jpeg',
          quality: 100
        });
        page.waitForNavigation();
        await page.content().then(
          data=>fs.writeFile(`codes/${thisip}_PC.html`, data, err=>{
            if(err)
              throw err
          })
        );
      } catch (error) {
        console.log(error)
      }

      // 再获取mobile
      await page.setViewport(smallScreen);
      await page.setUserAgent(mobileChromeUA);
      try {
        await page.goto(`http://${thisip}`, {waitUntil: ['domcontentloaded','networkidle0']});
        await page.screenshot({
          path: `screenshots/${thisip}_M.jpg`,
          type: 'jpeg',
          quality: 100
        });
        page.waitForNavigation();
        await page.content().then(
          data=>fs.writeFile(`codes/${thisip}_M.html`, data, err=>{
            if(err)
              throw err
          })
        );
      } catch (error) {
        console.log(error)
      }
    } //end of while
    await browser.close();
  })();
}