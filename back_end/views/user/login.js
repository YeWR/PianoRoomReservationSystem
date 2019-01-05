const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const request = require('request');
const configPath = "configs.json";
let fs = require("fs");
const configs = JSON.parse(fs.readFileSync(configPath));
const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");

const getUserIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

function getInfo(url) {
    return new Promise(function(resolve,reject) {
        request.get(url, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function parseInfo(res) {
    res = res.split(":");
    let info =  {
        "code": 0,
        "number": "",
        "name": "",
        "type": 0
    };
    for(let i of res)
    {
        i = i.split("=");
        switch(i[0])
        {
            case "code":
                info.code = parseInt(i[1]);
                break;
            case "zjh":
                info.number = i[1];
                break;
            case "xm":
                info.name = i[1];
                break;
            case "yhlb":
                if(i[1].charAt(0) === "X")
                {
                    info.type = constVariable.USERTYPE_STUDENT;
                }
                else if(i[1].charAt(0) === "J" || i[1].charAt(0) === "H")
                {
                    info.type = constVariable.USERTYPE_TEACHER;
                }
                break;
        }
    }
    return info;
}

const routers = router.post("/outSchool", async (ctx, next) => {
    let tele = ctx.request.body.phoneNumber,
        code = ctx.request.body.validateCode;
    if(!tele || !code)
    {
        ctx.response.body = {
            "success": false,
            "info": "手机号和验证码不能为空!"
        };
        return;
    }
    let result = await dataBase.SocietyUserLogin(tele,code);
    if(result.success === true)
    {
        let useruuid = await dataBase.GetUserUuidByNumber(tele);
        useruuid = useruuid.data;
        const userToken = {
             "userId": useruuid,
             "userType": constVariable.USERTYPE_OUTSCHOOL
         };
        const secret = configs.app_key[0];
        result.token = jwt.sign(userToken,secret, {"expiresIn": configs.expire_day * 24 * 60 * 60});
        ctx.response.body = result;
    }
    else
    {
        result.token = null;
        ctx.response.body = result;
    }
}).get("/inSchool", async (ctx, next) => {
    let ticket = ctx.query.ticket;
    let userIP = getUserIp(ctx.req).replace(/::ffff:/, '');
    userIP = userIP.split(".").join("_");
    let requestUrl = "https://id-tsinghua-test.iterator-traits.com/thuser/authapi/checkticket/" + configs.tsinghua_APPID +
        "/" + ticket + "/" + userIP;
    if(ticket)
    {
        let res = await getInfo(requestUrl);
        //let res = "code=0:zjh=2014013432:yhm=lizy14:xm=李肇阳:yhlb=X0031:dw=软件学院:email="; //mock
        let info = parseInfo(res);
        if(info.code !== 0)
        {
            let data = {
                "success": false,
                "token": null,
                "info": "票据验证失败! 错误代码:" + info.code.toString()
            };
            ctx.response.type = 'html';
            ctx.response.body = "<script type=\"text/javascript\" src=\"https://res.wx.qq.com/open/js/jweixin-1.3.2.js\"></script><script>wx.miniProgram.getEnv(function (res) {if (res.miniprogram) {wx.miniProgram.switchTab({url: '/pages/alarm/alarm'});wx.miniProgram.postMessage({data: " + JSON.stringify(data) + "});}})</script>";
        }
        else
        {
            let useruuid = uuid.v1().replace(/\-/g,'').substring(0,16);
            let result = await dataBase.CampusUserLogin(info.type,info.name,info.number, useruuid);
            if(result.success) {
                const userToken = {
                    "userId": result.info.uuid,
                    "userType": result.info.type,
                };
                const secret = configs.app_key[0];
                const token = jwt.sign(userToken, secret, {"expiresIn": configs.expire_day * 24 * 60 * 60});
                let data = {
                    "success": true,
                    "token": token,
                    "userType": info.type,
                    "idNumber": info.number,
                    "username": info.name
                };
                let dataString = JSON.stringify(data);
                ctx.response.type = 'html';
                ctx.response.body = "<script type=\"text/javascript\" src=\"https://res.wx.qq.com/open/js/jweixin-1.3.2.js\"></script><script>wx.miniProgram.getEnv(function (res) {if (res.miniprogram) {wx.miniProgram.postMessage({data: " + dataString + "});wx.miniProgram.switchTab({url: '/pages/alarm/alarm'});}})</script>";
            }
            else
            {
                let data = {
                    "success": false,
                    "token": null,
                    "info": "登录失败!"
                };
                ctx.response.type = 'html';
                ctx.response.body = "<script type=\"text/javascript\" src=\"https://res.wx.qq.com/open/js/jweixin-1.3.2.js\"></script><script>wx.miniProgram.getEnv(function (res) {if (res.miniprogram) {wx.miniProgram.switchTab({url: '/pages/alarm/alarm'});wx.miniProgram.postMessage({data: " + JSON.stringify(data) + "});}})</script>";
            }
        }
    }
    else
    {
        let data = {
            "success": false,
            "token": null,
            "info": "票据不存在!"
        };
        ctx.response.type = 'html';
        ctx.response.body = "<script type=\"text/javascript\" src=\"https://res.wx.qq.com/open/js/jweixin-1.3.2.js\"></script><script>wx.miniProgram.getEnv(function (res) {if (res.miniprogram) {wx.miniProgram.switchTab({url: '/pages/alarm/alarm'});wx.miniProgram.postMessage({data: " + JSON.stringify(data) + "});}})</script>";
    }
});

module.exports = routers;