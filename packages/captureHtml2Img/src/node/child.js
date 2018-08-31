const puppeteer = require('puppeteer');
const fs = require('fs');

process.on('message', function(m) {
  const { index, time, uids, env } = m

  async function getPic (arr, env, index, time) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate({
      viewport: {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        isMobile: true
      },
      userAgent: '"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"'
    });
  
    async function screenshotDOMElement (selector, index) {
      const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        const { x, y, width, height } = element.getBoundingClientRect();
        return { left: x, top: y, width, height, id: element.id };
      }, selector);
  
      console.log(rect)
      const dir = './img/' + index.toString().substr(-2)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0777)
      }

      return await page.screenshot({
        path: `${dir}/zaidai.${index}.png`,
        clip: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      });
    }
  
    let prefixUrl = env === 'prod' ? 'https://domain/distributePlan' : `https://${env}.domain/distributePlan`  
  
    for (let i of arr) {  
      let url = i;
      if (!url) continue;
      try {
        await page.goto(`${prefixUrl}?uid=${url}`, { waitUntil: 'networkidle2' });
  
        await screenshotDOMElement('.dis-content', url);
      } catch (e) {
        process.send({
          url,
          error: e.toString()
        })
        // fs.appendFileSync(`./userLeft.${time}.txt`, `${url},`);
        // fs.appendFileSync(`./error.${time}.txt`, `执行用户${url}时出错:${e}\n`);
      }
    }
  
    await browser.close();

    const diff = ((new Date()).getTime() - time) / 1000
    console.log(`child_precess${index}done,花费时间${diff}`)
  }

  getPic(uids, env, index, time)
});
