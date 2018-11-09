const Router = require("koa-router");
const router = new Router();

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;
    //todo: 数据库,加密
    console.log(`login with name: ${username}, password: ${password}`);
    if (username === "koa" && password === "12345") {
        ctx.response.body = {success:true};
    } else {
        ctx.response.body = {success:false};
    }
});

module.exports = routers;