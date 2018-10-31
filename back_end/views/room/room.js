const Router = require("koa-router");
const router = new Router();

const routers = router.get("/", async (ctx, next) => {
    const ids = ["F1-01","F1-02","F2-01","F2-02"];
    const infos = ["123","123","123","123"];
    const data = [];
    ctx.response.body = {}
});

module.exports = routers;