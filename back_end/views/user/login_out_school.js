const Router = require("koa-router");
const session = require("koa-session2");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    let tele = ctx.request.body.phoneNumber,
        code = ctx.request.body.validateCode;
    console.log(`login with tele: ${tele}`);
    let result = await dataBase.SocietyLogin(tele,code);
    if(result.success === true)
    {
        ctx.session.user = JSON.stringify({"user": tele})
    }
    ctx.response.body = result;
});

module.exports = routers;