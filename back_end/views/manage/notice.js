const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");


function getDateStr (date) {
    let dateStr = date.getFullYear().toString() + "-";
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(month < 10)
    {
        dateStr = dateStr + "0" + month.toString() + "-";
    }
    else
    {
        dateStr = dateStr + month.toString() + "-";
    }
    if(day < 10)
    {
        dateStr = dateStr + "0" + day.toString();
    }
    else
    {
        dateStr = dateStr + day.toString();
    }
    if(hour < 10)
    {
        dateStr = dateStr + " " + "0" + hour.toString();
    }
    else
    {
        dateStr = dateStr + " " + hour.toString();
    }
    if(minute < 10)
    {
        dateStr = dateStr + ":0" + minute.toString();
    }
    else
    {
        dateStr = dateStr + ":" + minute.toString();
    }
    return dateStr;
}

const routers = router.get("/list", async (ctx, next) => {
    let result = await dataBase.GetNoticeAll();
    let noticeList = [];
    for(let notice of result.data)
    {
        let date = new Date(notice.notice_time);
        let dateStr = getDateStr(date);
        let temp = {
            "title": notice.notice_title,
            "date": dateStr,
            "author": notice.notice_auth,
            "id": notice.notice_id,
        };
        noticeList.push(temp);
    }
    noticeList.reverse();
    ctx.response.status = 200;
    ctx.response.body = {
        "items": noticeList,
        "total": noticeList.length
    }
}).post("/create", async (ctx, next) => {
    let info = ctx.request.body;
    let title = "123";
    let content = "123";
    let time = "2018-12-05 08:00";
    let auth = "zzh";
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
    let dateStr = getDateStr(date);
    ctx.response.status = 200;
    ctx.response.body = {
        "title": result.data.notice_title,
        "date": dateStr,
        "author": result.data.notice_auth,
        "content": result.data.notice_cont
    }
});

module.exports = routers;