const Router = require("koa-router");
const session = require("koa-session2");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.veriCode;
    console.log(`login with name: ${username}, password: ${password}`);
    let result = await dataBase.SocietyLogin(username,password);
    if(result.success === true)
    {
        ctx.session.user = JSON.stringify({"username": username})
    }
    ctx.response.body = result;
});

module.exports = routers;