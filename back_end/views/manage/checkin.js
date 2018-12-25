const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

const routers = router.get("/", async (ctx, next) => {
    let uuid = ctx.query.id;
    // add lock in itemCheckin
    let result = await dataBase.ItemCheckin(uuid);
    if(result.success)
    {
        ctx.response.status = 200;
    }
    else
    {
        ctx.response.status = 400;
        ctx.response.body = {
            "info": result.info
        };
    }
});

module.exports = routers;