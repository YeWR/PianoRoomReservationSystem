const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const utils = require("../utils");

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    let page = query.page;
    let limit = parseInt(query.limit);
    if(!query.status)
    {
        query.status = [1,2,-1,-2,-3];
    }
    else
    {
        query.status = parseInt(query.status) - 3;
    }
    let userId = await dataBase.GetSocietyUuidByTele(ctx.query.idNumber);
    userId = userId.data;
    let result = await dataBase.SearchItem(limit, (page-1)*limit, userId, query.room, query.itemType, query.status, query.timeSort, null);
    let reservationList = [];
    let pianoInfo = await dataBase.GetPianoRoomAll();
    for(let p of result.data)
    {
        for(let i of pianoInfo.data)
        {
            if (i.piano_id === p.item_roomId)
            {
                let date = new Date(p.item_date);
                let dateStr = utils.getDateStr_Index(date, p);
                let userInfo = await dataBase.GetSocietyUserInfo(p.item_username);
                let info = {
                    "idNumber": userInfo.data.soc_tele,
                    "room": i.piano_room,
                    "itemType": p.item_member,
                    "userType": 2,
                    "pianoType": i.piano_type,
                    "price": p.item_value,
                    "status": parseInt(p.item_type) + 3,
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
    let uuid = ctx.request.body.itemId;
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
}).get("/scan", async (ctx, next) => {
    let dateToday = new Date();
    let queryDateStr = utils.getDateStr(dateToday);
    let result = await dataBase.SearchItem(2147483647, 0, null, null, null, 1, '-', queryDateStr);
    let reservationList = [];
    let pianoInfo = await dataBase.GetPianoRoomAll();
    for(let p of result.data)
    {
        for(let i of pianoInfo.data)
        {
            if (i.piano_id === p.item_roomId)
            {
                let date = new Date(p.item_date);
                let dateStr = utils.getDateStr_Index(date, p);
                let userInfo = await dataBase.GetSocietyUserInfo(p.item_username);
                let info = {
                    "idNumber": userInfo.data.soc_tele,
                    "room": i.piano_room,
                    "itemType": p.item_member,
                    "userType": 2,
                    "pianoType": i.piano_type,
                    "price": p.item_value,
                    "status": parseInt(p.item_type) + 3,
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
        "list": reservationList
    };
});

module.exports = routers;