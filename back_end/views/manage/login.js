const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));
const jwt = require("jsonwebtoken");

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.userName,
        usertype = ctx.request.body.userType,
        password = ctx.request.body.password;
    for(let manager of configs.managerInfo)
    {
        if(username === manager.name && password === manager.password && usertype === manager.type)
        {
            ctx.response.status = 200;
            const userToken = {
                "userId": username,
                "userType": usertype
            };
            const secret = configs.app_key[0];
            const token = jwt.sign(userToken,secret);
            ctx.response.body = {
                "realName": manager.realName,
                "token": token
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