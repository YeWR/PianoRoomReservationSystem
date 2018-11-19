const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

function sortNotice(a,b)
{
    a_date = new Date(a.notice_time);
    b_date = new Date(b.notice_time);
    if(a_date.getTime() - b_date.getTime() > 0)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}

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
        dateStr = dateStr + "0" + day.toString() + "-";
    }
    else
    {
        dateStr = dateStr + day.toString() + "-";
    }
    //dateStr = dateStr + " " + hour.toString() + ":" + minute.toString();
    return dateStr;
}

const routers = router.post("/all", async (ctx, next) => {
    let result = await dataBase.GetNoticeAll();
    result.data.sort(sortNotice);
    let noticeList = [];
    for(let notice of result.data)
    {
        if(notice.notice_type)
        {
            let date = new Date(notice.notice_time);
            let dateStr = getDateStr(date);
            let noticeKey = "";
            if(notice.notice_cont.length() > 10)
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
    }
    ctx.response.body = {
        "success": true,
        "noticeList": noticeList
    }
}).post("/detail", async (ctx, next) => {
    let noticeId = ctx.request.body.noticeId;
    let result = await dataBase.GetNoticeInfo(noticeId);
    let notice = result.data;
    let date = new Date(notice.notice_time);
    let dateStr = getDateStr(date);
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
});

module.exports = routers;