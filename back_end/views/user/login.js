const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const request = require('request');
const configPath = "configs.json";
let fs = require("fs");
const configs = JSON.parse(fs.readFileSync(configPath));

const getUserIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

function getInfo(url) {
    console.log(url);

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

const routers = router.post("/outSchool", async (ctx, next) => {
    console.log(ctx.request.body);
    let tele = ctx.request.body.phoneNumber,
        code = ctx.request.body.validateCode;
    console.log(`login with tele: ${tele}`);
    let result = await dataBase.SocietyLogin(tele,code);
    //let result = {"success": true};
    if(result.success === true)
    {
        let useruuid = await dataBase.GetSocietyUuidByTele(tele);
        useruuid = useruuid.data;
        ctx.session.userId = useruuid;
        ctx.session.userType = constVariable.USERTYPE_OUTSCHOOL;
    }
    else
    {
        ctx.session = null;
    }
    ctx.response.body = result;
}).get("/inSchool", async (ctx, next) => {
    let ticket = ctx.query.ticket;
    let userIP = getUserIp(ctx.req).replace(/::ffff:/, '');
    userIP = userIP.split(".").join("_");
    let requestUrl = "https://id-tsinghua-test.iterator-traits.com/thuser/authapi/checkticket/" + configs.tsinghua_APPID +
        "/" + ticket + "/" + userIP;
    if(ticket)
    {
        let res = await getInfo(requestUrl);
        console.log(res);
        ctx.response.body = res;
    }
});

module.exports = routers;