const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const utils = require("../utils");

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    console.log(query);
    let page = 1;
    if(query.page)
    {
        page = parseInt(query.page);
    }
    let limit = 20;
    if(query.limit)
    {
        limit = parseInt(query.limit);
    }
    let title = query.title;
    let author = query.author;
    let order = query.dateSort;
    let result = await dataBase.SearchNotice(limit, (page-1)*limit, title, author, order);
    console.log(result);
    let noticeList = [];
    for(let notice of result.data)
    {
        let date = new Date(notice.notice_time);
        let dateStr = utils.getDatetimeStr(date);
        let temp = {
            "title": notice.notice_title,
            "date": dateStr,
            "author": notice.notice_auth,
            "id": notice.notice_id,
        };
        noticeList.push(temp);
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "items": noticeList,
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
}).post("/delete", async (ctx, next) => {
    let id = ctx.request.body.id;
    let result = await dataBase.DeleteNotice(id);
    ctx.response.status = 200;
}).get("/detail", async (ctx, next) => {
    let id = ctx.query.id;
    let result = await dataBase.GetNoticeInfo(id);
    let date = new Date(result.data.notice_time);
    let dateStr = utils.getDatetimeStr(date);
    ctx.response.status = 200;
    ctx.response.body = {
        "title": result.data.notice_title,
        "date": dateStr,
        "author": result.data.notice_auth,
        "content": result.data.notice_cont
    }
});

module.exports = routers;