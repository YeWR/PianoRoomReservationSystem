const Router = require("koa-router");
const router = new Router();

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request)
    let username = ctx.request.body.username,
        password = ctx.request.body.password,
        realname = ctx.request.body.realname,
        idNumber = ctx.request.body.idNumber;
    //todo: 数据库,加密
    console.log(`signin with name: ${username}, password: ${password}`);
    if (username === "koa" && password === "12345") {
        ctx.response.body = {success:true};
    } else {
        ctx.response.body = {success:false};
    }
});

module.exports = routers;