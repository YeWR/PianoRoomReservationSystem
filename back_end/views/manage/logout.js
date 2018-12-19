const Router = require("koa-router");
const router = new Router();

const routers = router.post("/", async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.body = {};
});

module.exports = routers;