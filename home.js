const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const moment = require("moment");
class Index{
    constructor(){
        this.home = 'https://bing.ioliu.cn';
        this.pages = null;
        this.currentPage = 1;
    }
    async init(){
        let page;
        let _index = await axios.get(this.home);
        let html = _index.data;
        let $ = cheerio.load(html);
        $('.page span').each((i,e) => {
            page = $(e).text();
        })
        this.pages = Number(page.trim().split('/')[1].trim());
    }
    async getImg(pageNum){
        let url = this.home + '?p=' + pageNum;
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);
        let arr = [];
        $('.item img').each((i,e) => {
            // console.log($(e).attr('src'));
            let imgUrl = $(e).attr('src');
            if(!imgUrl){
                return;
            }
            if(history.includes(tools.md5(imgUrl))){
                tools.log('alreadt exists',imgUrl);
                return;
            }
            arr.push(imgUrl);
        })
        return new Promise((resolve,reject) => {
            async.eachLimit(arr,config.downspeed,(item,callback) => {
                let pathObj = path.parse(item);
                let fileName = pathObj.name.split('_')[0] + pathObj.ext;
                let filePath = `${baseDir}/pic/${fileName}`;
                this.download(item,filePath).then(() => {
                    return callback();
                });
            },(err,res) => {
                resolve();
            })
        })
    }

    async download(url,filePath){
        let count = 0;
        await down(url);
        return;
        async function down(url){
            count++;
            axios({
                url:url,
                method:"get",
                // timeout:10000,
                responseType:'stream'
            }).then((res) => {
                tools.log('downloading...',url);
                res.data.pipe(fs.createWriteStream(filePath));
                fs.appendFileSync('./history.list',tools.md5(url) + '\r\n');
                return;
            }).catch((e) => {
                // console.error(e.message);
                tools.log(e.message);
                if(count > 3){
                    return;
                }
                tools.log('download fail,reconnect...',url);
                return down(url);
            })
        }
    }
}

module.exports = new Index();