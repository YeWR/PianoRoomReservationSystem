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
        let useruuid = await dataBase.GetSocietyUuidByTele(tele);
        useruuid = useruuid.data;
        ctx.session.userId = useruuid;
        ctx.session.userType = constVariable.USERTYPE_OUTSCHOOL;
    }
    ctx.response.body = result;
}).post("/inSchool", async (ctx, next) => {
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
    ctx.response.body = result;
});

module.exports = routers;