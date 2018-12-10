const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    let page = query.page;
    let limit = parseInt(query.limit);
    let result = await dataBase.SearchPiano(limit, (page-1)*limit, query, query);
    let pianoList = [];
    for(let piano of result.data)
    {
        let temp = {
            "title": piano.piano_title,
            "date": dateStr,
            "author": piano.piano_auth,
            "id": piano.piano_id,
        };
        pianoList.push(temp);
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "items": pianoList,
        "total": result.count
    }
}).post("/create", async (ctx, next) => {
    let title = ctx.request.body.title;
    let content = ctx.request.body.content;
    let time = ctx.request.body.time;
    let auth = ctx.request.body.author;
    console.log(ctx.request.body);
    let result = await dataBase.InsertNotice(title,content,time,auth,1);
    ctx.response.status = 200;
}).post("/update", async (ctx, next) => {
    let id = ctx.request.body.id;
    let result = await dataBase.DeleteNotice(id);
    ctx.response.status = 200;
});

module.exports = routers;