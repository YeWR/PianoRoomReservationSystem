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
    let dateStr = date.getFullYear().toString() + "年";
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(month < 10)
    {
        dateStr = dateStr + "0" + month.toString() + "月";
    }
    else
    {
        dateStr = dateStr + month.toString() + "月";
    }
    if(day < 10)
    {
        dateStr = dateStr + "0" + day.toString() + "日";
    }
    else
    {
        dateStr = dateStr + day.toString() + "日";
    }
    dateStr = dateStr + " " + hour.toString() + ":" + minute.toString();
    return dateStr;
}

const routers = router.post("/all", async (ctx, next) => {
    let result = await dataBase.GetNoticeAll();
    result.sort(sortNotice);
    let noticeList = [];
    for(let notice of result)
    {
        if(notice.notice_type)
        {
            let temp = notice;
            let date = new Date(notice.notice_time);
            let dateStr = getDateStr(date);
        }
    }
    ctx.response.body = {
        "success": true,
        "noticeList": noticeList
    }
});

module.exports = routers;