const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const constVariable = require("../const");
const uuid = require("node-uuid");

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request.body);
    let phoneNumber = ctx.request.body.phoneNumber,
        validateCode = ctx.request.body.validateCode,
        realname = ctx.request.body.realName,
        idNumber = ctx.request.body.idNumber,
        useruuid = uuid.v1().replace(/\-/g,'').substring(0,16);
    let result = await dataBase.SocietyUserRegister(constVariable.USERTYPE_OUTSCHOOL,idNumber,realname,phoneNumber,useruuid,validateCode);
    ctx.response.body = result;
});
module.exports = routers;