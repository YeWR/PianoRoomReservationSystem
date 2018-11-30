const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.userName,
        usertype = ctx.request.body.userType,
        password = ctx.request.body.password;
    for(let manager of configs.managerInfo)
    {
        if(username === manager.name && password === manager.password && usertype === manager.type)
        {
            ctx.session.userId = username;
            ctx.session.userType = usertype;
            ctx.response.status = 200;
            ctx.response.body = {"realName": manager.realName};
            return;
        }
    }
    ctx.response.status = 401;
    ctx.response.body = {
        "info": "用户名或密码错误"
    };
});

module.exports = routers;