const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

const routers = router.post("/all", async (ctx, next) => {
    let result = await dataBase.GetNoticeAll();
    console.log(result);
});

module.exports = routers;