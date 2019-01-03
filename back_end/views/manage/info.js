const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));
const jwt = require("jsonwebtoken");

const routers = router.get("/", async (ctx, next) => {
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
            "info": "登录状态已失效, 请重新登录!"
        };
        return
    }
    for(let manager of configs.managerInfo)
    {
        if(token.userId === manager.name && token.userType === manager.type)
        {
            let roles = "";
            if(manager.type === "0" || manager.type === 0)
            {
                roles = "admin";
            }
            else
            {
                roles = "editor";
            }
            ctx.response.status = 200;
            ctx.response.body = {
                "name": manager.realName,
                "roles": [roles]
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