const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");

const routers = router.post("/outSchool", async (ctx, next) => {
    console.log(ctx.request.body);
    let tele = ctx.request.body.phoneNumber,
        code = ctx.request.body.validateCode;
    console.log(`login with tele: ${tele}`);
    let result = await dataBase.SocietyLogin(tele,code);
    //let result = {"success": true};
    if(result.success === true)
    {
        ctx.session.userId = tele;
        ctx.session.userType = constVariable.USERTYPE_OUTSCHOOL;
    }
    ctx.response.body = result;
}).post("/cookie", async (ctx, next) => {
    let response = {
        "success": 0,
        "userType": null,
        "realName": null,
        "idNumber": null,
        "info": null
    }
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
                response.success = 1;
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
        response.info = "无cookie或cookie过期";
    }
    ctx.response.body = response;
});

module.exports = routers;