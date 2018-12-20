const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const jwt = require("jsonwebtoken");

const routers = router.get("/", async (ctx, next) => {
    let response = {
        "success": false,
        "userType": null,
        "realName": null,
        "idNumber": null,
        "info": null
    };

    console.log(ctx.session);
    if(ctx.session.userId && ctx.session.userType)
    {
        let userInfo = null;
        userInfo = await dataBase.GetUserInfo(ctx.session.userId);
        if(userInfo.data)
        {
            response.success = true;
            response.userType = userInfo.data.type;
            response.realName = userInfo.data.realname;
            response.idNumber = userInfo.data.number;
        }
        else
        {
            response.info = userInfo.info;
        }
    }
    else
    {
        response.info = "无cookie或cookie过期,请重新登录!";
    }
    ctx.response.body = response;
});

module.exports = routers;