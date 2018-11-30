const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const uuid = require("node-uuid");

function sortItemAll(a, b)
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

function sortItemAlarm(a, b)
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
    let dateStr = date.getFullYear().toString() + "-";
    let month = date.getMonth()+1;
    let day = date.getDate();
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
    return dateStr;
}

function compTime(nowdate, date, endIndex)
{
    date.setHours(8+Math.floor(endIndex/6),10*(endIndex%6),0);
    //console.log("nowdate ", nowdate, "date ", date);
    if(date.getTime() - nowdate.getTime() > 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

const routers = router.post("/refundment", async (ctx, next) => {
    let uuid = ctx.request.body.reservationId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
}).post("/all", async (ctx, next) => {
    let number = ctx.request.body.number;
    let userId = await dataBase.GetSocietyUuidByTele(number);
    userId = userId.data;
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
        reservationList = reservationList.sort(sortItemAll);
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
}).post("/alarm", async (ctx, next) => {
    let number = ctx.request.body.number;
    let userId = await dataBase.GetSocietyUuidByTele(number);
    userId = userId.data;
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
        for(let p of result.data)
        {
            if(p.item_type)
            {
                let date = new Date(p.item_date);
                if(compTime(nowDate, date, p.item_begin+p.item_duration))
                {
                    for(let i of pianoInfo.data)
                    {
                        if (i.piano_id === p.item_roomId)
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
                            break;
                        }
                    }
                }
            }
        }
        reservationList = reservationList.sort(sortItemAlarm);
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
    console.log(ctx.response.body);
}).post("/order", async (ctx, next) => {
    //todo:一个用户不能同时使用多个琴房
    console.log(ctx.request.body);
    let number = ctx.request.body.number;
    let userId = await dataBase.GetSocietyUuidByTele(number);
    userId = userId.data;
    let userInfo = await dataBase.GetSocietyUserInfo(userId);
    if(userInfo.data.soc_type)
    {
        let pianoId = ctx.request.body.pianoId;
        let reserveType = parseInt(ctx.request.body.reservationType);
        let pianoPrice = parseInt(ctx.request.body.pianoPrice);
        let begTimeIndex = parseInt(ctx.request.body.begTimeIndex);
        let endTimeIndex = parseInt(ctx.request.body.endTimeIndex);
        let dateStr = ctx.request.body.date;
        dateStr.concat(" 08:00:00");
        let duration = endTimeIndex - begTimeIndex;
        let itemUuid = uuid.v1();
        let result = await dataBase.InsertItem(dateStr, userId, pianoId, 1, reserveType, pianoPrice, duration, begTimeIndex, itemUuid);
        ctx.response.body = result;
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "info": "您已被加入黑名单，无法预约，请联系管理员!"
        }
    }
    //console.log(ctx.response.body);
});

module.exports = routers;