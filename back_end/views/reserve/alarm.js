const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

function sortItem(a, b)
{
    if(a.date > b.date)
    {
        return 1;
    }
    else if(a.date < b.date)
    {
        return -1;
    }
    else
    {
        if(a.begTimeIndex > b.begTimeIndex)
        {
            return 1;
        }
        else if(a.begTimeIndex < b.begTimeIndex)
        {
            return -1;
        }
        else
            return 0;
    }
}

function getDateStr (date) {
    let dateStr = date.getFullYear().toString() + "年";
    let month = date.getMonth()+1;
    let day = date.getDate();
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
    return dateStr;
}

function compTime(nowdate, date, endIndex)
{
    date.setHours(8+Math.floor(endIndex/6),10*(endIndex%6),0);
    console.log("nowdate ", nowdate, "date ", date);
    if(date.getTime() - nowdate.getTime() > 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

const routers = router.post("/all", async (ctx, next) => {
    let userId = ctx.request.body.number;
    let result = await dataBase.GetItem(userId);
    if(result.data === null)
    {
        ctx.response.body = {"reservationList": null, "errorMsg":result.info};
    }
    else
    {
        let reservationList = [];
        let pianoInfo = await dataBase.GetPianoRoomAll();
        let nowDate = new Date();
        for(let p of result.data) {
            for(let i of pianoInfo.data)
            {
                if(i.piano_id === p.item_roomId)
                {
                    let date = new Date(p.item_date);
                    if(compTime(nowDate, date, p.item_begin+p.item_duration))
                    {
                        let dateStr = getDateStr(date);
                        let week = date.getDay();
                        const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                        let info = {
                            "pianoPlace": i.piano_room,
                            "pianoType": i.piano_type,
                            "pianoPrice": p.item_value,
                            "reservationType": p.item_member,
                            "reservationState": p.item_type,
                            "reservationId": p.item_uuid,
                            "date": dateStr,
                            "weekday": weekStr[week],
                            "begTimeIndex": p.item_begin,
                            "endTimeIndex": p.item_begin + p.item_duration,
                        };
                        reservationList.push(info);
                    }
                    break;
                }
            }
        }
        reservationList = reservationList.sort(sortItem);
        ctx.response.body = {"reservationList": reservationList};
    }
    console.log(ctx.response.body);
});

module.exports = routers;