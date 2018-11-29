const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;
    if(username === configs.manage_username && password === configs.manage_password)
    {
        ctx.session.userId = username;
        ctx.session.userType = constVariable.USERTYPE_MANAGER;
        ctx.response.body = {"success": true};
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "info": "用户名或密码错误"
        };
    }
});

module.exports = routers;