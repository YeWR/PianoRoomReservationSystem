const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

function getDateStr (date, p) {
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
        dateStr = dateStr + "0" + day.toString() + " ";
    }
    else
    {
        dateStr = dateStr + day.toString() + " ";
    }
    let startHour = 8 + Math.floor(p.item_begin / 6);
    let startMinute = 10 * p.item_begin % 6;
    let endHour = 8 + Math.floor((p.item_begin + p.item_duration) / 6);
    let endMinute = 10 * (p.item_begin + p.item_duration) % 6;
    if(startHour < 10)
    {
        dateStr = dateStr + "0" + startHour.toString() + ":";
    }
    else
    {
        dateStr = dateStr + startHour.toString() + ":";
    }
    if(startMinute < 10)
    {
        dateStr = dateStr + "0" + startMinute.toString() + "-";
    }
    else
    {
        dateStr = dateStr + startMinute.toString() + "-";
    }
    if(endHour < 10)
    {
        dateStr = dateStr + "0" + endHour.toString() + ":";
    }
    else
    {
        dateStr = dateStr + endHour.toString() + ":";
    }
    if(endMinute < 10)
    {
        dateStr = dateStr + "0" + endMinute.toString();
    }
    else
    {
        dateStr = dateStr + endMinute.toString();
    }
    return dateStr;
}

const routers = router.get("/list", async (ctx, next) => {
    /*"page": "页码",
        "limit": "每页最多个数",
        "idNumber": "手机号/证号",
        "room": "琴房号",
        "userType": "单人/多人",
        "status": "订单状态"
    "timeSort": "+代表顺序,-代表逆序"
    "idNumber": "手机号/证号",
            "room": "琴房号",
            "itemType": "订单类型"
            "userType": "用户类型",
            "pianoType": "钢琴类型",
            "price": "钢琴价格",
            "status": "订单状态",
            "time": "订单时间"*/

    let query = ctx.query;
    let page = query.page;
    let limit = parseInt(query.limit);
    if(!query.status)
    {
        query.status = [1,2,-1,-2,-3];
    }
    let userId = await dataBase.GetSocietyUuidByTele(ctx.query.idNumber);
    userId = userId.data;
    let result = await dataBase.SearchItem(limit, (page-1)*limit, userId, query.room, query.itemType, query.status, query.timeSort);
    let reservationList = [];
    let pianoInfo = await dataBase.GetPianoRoomAll();
    for(let p of result.data)
    {
        for(let i of pianoInfo.data)
        {
            if (i.piano_id === p.item_roomId)
            {
                let date = new Date(p.item_date);
                let dateStr = getDateStr(date, p);
                let userInfo = await dataBase.GetSocietyUserInfo(p.item_username);
                let info = {
                    "idNumber": userInfo.data.soc_tele,
                    "room": i.piano_room,
                    "itemType": p.item_member,
                    "userType": 2,
                    "pianoType": i.piano_type,
                    "price": p.item_value,
                    "status": p.item_type,
                    "time": dateStr,
                    "itemId": p.item_uuid
                };
                reservationList.push(info);
                break;
            }
        }
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "list": reservationList,
        "total": result.count
    };
}).post("/refundment", async (ctx, next) => {
    let uuid = ctx.request.body.reservationId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
});

module.exports = routers;