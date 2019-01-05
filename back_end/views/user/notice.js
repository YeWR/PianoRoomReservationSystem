const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const utils = require("../utils");

const routers = router.get("/all", async (ctx, next) => {
    let result = await dataBase.GetNoticeAll();
    let noticeList = [];
    for(let notice of result.data)
    {
        let date = new Date(notice.notice_time);
        let dateStr = utils.getDatetimeStr(date);
        let noticeKey = "";
        if(notice.notice_cont.length > 10)
        {
            noticeKey = notice.notice_cont.substring(0,10) + "...";
        }
        else
        {
            noticeKey = notice.notice_cont;
        }
        let temp = {
        "noticeTitle": notice.notice_title,
        "noticeTime": dateStr,
        "noticeAuthor": notice.notice_auth,
        "noticeId": notice.notice_id,
        "noticeKey": noticeKey,
        "noticeContent": notice.notice_cont
        };
        noticeList.push(temp);
    }
    noticeList.reverse();
    ctx.response.body = {
        "success": true,
        "noticeList": noticeList
    }
}).post("/detail", async (ctx, next) => {
    let noticeId = ctx.request.body.noticeId;
    let result = await dataBase.GetNoticeInfo(noticeId);
    if(result.success)
    {
        let notice = result.data;
        let date = new Date(notice.notice_time);
        let dateStr = utils.getDatetimeStr(date);
        let info = {
            "noticeTitle": notice.notice_title,
            "noticeTime": dateStr,
            "noticeAuthor": notice.notice_auth,
            "noticeContent": notice.notice_cont
        };
        ctx.response.body = {
            "success": true,
            "notice": info
        }
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "notice": null,
            "info": result.info
        }
    }
});

module.exports = routers;