const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const jwt = require("jsonwebtoken");
const configPath = "configs.json";
let fs = require("fs");
const configs = JSON.parse(fs.readFileSync(configPath));

const routers = router.get("/", async (ctx, next) => {
    let response = {
        "success": false,
        "userType": null,
        "realName": null,
        "idNumber": null,
        "info": null
    };
    let token = ctx.query.token;
    const secret = configs.app_key[0];
    try
    {
        token = jwt.verify(token, secret);
    }
    catch(err)
    {
        ctx.response.status = 401;
        ctx.response.body = {
            "info": "Invalid token"
        };
        return
    }
    console.log(token);
    if(token.userId && token.userType !== null && token.userType !== undefined)
    {
        let userInfo = await dataBase.GetUserInfo(token.userId);
        if(userInfo.data && userInfo.data.type === token.userType)
        {
            response.success = true;
            response.userType = userInfo.data.type;
            response.realName = userInfo.data.realname;
            response.idNumber = userInfo.data.number;
        }
        else
        {
            response.info = "token验证错误";
        }
    }
    else
    {
        response.info = "无cookie或cookie过期,请重新登录!";
    }
    ctx.response.body = response;
});

module.exports = routers;