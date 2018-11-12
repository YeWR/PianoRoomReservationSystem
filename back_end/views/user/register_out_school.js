const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request.body);
    let phoneNumber = ctx.request.body.phoneNumber,
        validateCode = ctx.request.body.validateCode,
        realname = ctx.request.body.realName,
        idNumber = ctx.request.body.idNumber;
    let result = await dataBase.SocietyRegister(1,idNumber,realname,phoneNumber,validateCode);
    ctx.response.body = result;
    console.log(`signin with number: ${phoneNumber}`);
})
module.exports = routers;