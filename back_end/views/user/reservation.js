const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

function sortItem(a, b)
{
    if(a.date > b.date)
    {
        return -1;
    }
    else if(a.date < b.date)
    {
        return 1;
    }
    else
    {
        if(a.begTimeIndex > b.begTimeIndex)
        {
            return -1;
        }
        else if(a.begTimeIndex < b.begTimeIndex)
        {
            return 1;
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

const routers = router.post("/refund", async (ctx, next) => {
    let uuid = ctx.request.body.reservationId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
}).post("/all", async (ctx, next) => {
    let number = ctx.request.body.number;
    let userId = dataBase.GetSocietyUuidByTele(number);
    let result = await dataBase.GetItem(userId);
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "reservationList": null,
            "info": result.info
        };
    }
    else
    {
        let reservationList = [];
        const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let pianoInfo = await dataBase.GetPianoRoomAll();
        let nowDate = new Date();
        nowDate.setHours(0,0,0);
        for(let p of result.data)
        {
            if(p.item_type)
            {
                for(let i of pianoInfo.data)
                {
                    if (i.piano_id === p.item_roomId)
                    {
                        let date = new Date(p.item_date);
                        if(nowDate-date < 1000*60*60*24*30)
                        {
                            let dateStr = getDateStr(date);
                            let week = date.getDay();
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
                                "endTimeIndex": p.item_begin + p.item_duration
                            };
                            reservationList.push(info);
                        }
                        break;
                    }
                }
            }
        }
        reservationList = reservationList.sort(sortItem);
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
});

module.exports = routers;