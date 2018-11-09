const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;
    console.log(`login with name: ${username}, password: ${password}`);
    let result = await dataBase.SocietyLogin(username,password);
    ctx.response.body = result;
});

module.exports = routers;