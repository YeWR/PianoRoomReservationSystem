const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");

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
        console.log("cookie:", ctx.session.userId);
        if(ctx.session.userType === constVariable.USERTYPE_OUTSCHOOL)
        {
            userInfo = await dataBase.GetSocietyUserInfo(ctx.session.userId);
            if(userInfo.data)
            {
                response.success = true;
                response.userType = constVariable.USERTYPE_OUTSCHOOL;
                response.realName = userInfo.data.soc_realname;
                response.idNumber = userInfo.data.soc_tele;
            }
            else
            {
                response.info = userInfo.info;
            }
        }
    }
    else
    {
        response.info = "无cookie或cookie过期,请重新登录!";
    }
    ctx.response.body = response;
});

module.exports = routers;