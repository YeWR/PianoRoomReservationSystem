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
            "type": notice.notice_type,
            "date": dateStr,
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
}).post("/add", async (ctx, next) => {
    //let info = ctx.request.body;
    //let title = "123";
    //let content = "123";
    //let time =
    //let result = await dataBase.InsertNotice(title,content,time,auth,1);
    ctx.response.status = 200;
});

module.exports = routers;