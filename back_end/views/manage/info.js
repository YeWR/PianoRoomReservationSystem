const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));
const jwt = require("jsonwebtoken");

const routers = router.get(":token", async (ctx, next) => {
    let token = ctx.params.token;
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
    for(let manager of configs.managerInfo)
    {
        if(token.userId === manager.name && token.userType === manager.type)
        {
            ctx.response.status = 200;
            ctx.response.body = {
                "realName": manager.realName,
                "userType": "admin"
            };
            return;
        }
    }
    ctx.response.status = 401;
    ctx.response.body = {
        "info": "用户名或密码错误"
    };
});

module.exports = routers;