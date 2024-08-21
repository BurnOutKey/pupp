const path = require('path');
const extensionPath = path.join(__dirname, './extension');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Puppeteer {
    constructor() {
      this.ready = false;
      this.url = "";
      this.type = 0;
      this.options = {
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
        headless: true,
      };
    }
  
    async run(Type = this.type) {
     if(this.url) await this.browser.close()
      console.log("Starting.");
      this.ready = false;
  
      const Types = ["dev.", "sandbox.", ""];
  
      this.url = `http://${Types[Type]}moomoo.io`;
  
      this.head = require("puppeteer");
  
    this.browser = await this.head.launch({
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
        ],
        defaultViewport: { 
          width: 1366 + Math.floor(Math.random() * 100), 
          height: 768 + Math.floor(Math.random() * 100) 
        },
      });
  
      console.log("Browser launched.");
  
      this.page = await this.browser.newPage();
  
      console.log("Page opened.");
  
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      });

      await this.page.goto(this.url);
  
      await delay(Math.random() * 1000);
  await this.page.mouse.move(50 + Math.random() * 500, 50 + Math.random() * 500);
  await this.page.mouse.down();
  await this.page.mouse.up();

      this.ready = true;
  
      console.log("Puppeteer's ready!");
    }
  
    async getToken() {
      if(!this.ready) return "Wait";
  
      const Token = await this.page.evaluate(async () => {
        return await new Promise((resolve) => {
          window.grecaptcha
            .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
              action: "homepage",
            })
            .then((token) => {
              resolve(encodeURIComponent(token));
            });
        });
      });
  
      if(Token.length < 300) {
        Token = "Fail";
        
        this.type += 1;
        if(this.type >= 3) this.type = 0;
  
        run(this.type);
      }
  
      return Token;
    }
  }
  
  module.exports = Puppeteer;