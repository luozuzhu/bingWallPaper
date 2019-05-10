const moment = require("moment");
const fs = require("fs");
const crypto = require("crypto");
module.exports = {
    log:function(...arg){
        let str = arg.join(' ');
        str = moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + str;
        fs.appendFileSync('./down.log','\r\n' + str);
    },
    md5:function(str){
        return crypto.createHash('md5').update(str).digest("hex");
    }
}