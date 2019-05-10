global.axios = require("axios");
global.cheerio = require("cheerio");
global.async = require("async");
global.config = require("./config.js");
global.tools = require("./tools.js")
global.baseDir = __dirname;
const fs = require("fs");
const path = require("path");
const home = require("./home");
(async () => {
    if(!fs.existsSync('./down.log')){
        fs.writeFileSync("./down.log",'### down load logs');
    }
    let history = fs.readFileSync("./history.list",'utf8');
    if(!history){
        global.history = [];
    }else{
        global.history = history.split("\r\n");
    }
    await home.init();
    for(let i=1;i<=home.pages;i++){
        await home.getImg(i);
    }
})()
