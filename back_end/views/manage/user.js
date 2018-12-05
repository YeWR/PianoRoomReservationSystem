const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    let page = query.page;
    let limit = parseInt(query.limit);
    let result = await dataBase.SearchSocietyUser(limit, (page-1)*limit,soc_tele, soc_realname, soc_id, soc_type);
    let userList = [];
    for(let p of result.data)
    {
        let info = {};
        userList.push(info);
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "list": userList,
        "total": result.count
    };
}).post("/blacklist/set", async (ctx, next) => {
    let uuid = ctx.request.body.userId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
}).post("/blacklist/remove", async (ctx, next) => {
    let uuid = ctx.request.body.userId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
});

module.exports = routers;