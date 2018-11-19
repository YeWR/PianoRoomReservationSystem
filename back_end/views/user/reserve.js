const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const uuid = require("node-uuid");

const routers = router.post("/all", async (ctx, next) => {
    console.log(ctx.request.body);
    let result = await dataBase.GetPianoRoomAll();
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "pianoList": null,
            "info":result.info
        };
    }
    else
    {
        let pianolist = [];
        for(let p of result.data)
        {
            let timeList = [];
            for(let i = 0; i<p.piano_list.data.length;i++)
            {
                timeList.push(p.piano_list.data[i] - 48);
            }
            let info = {
                "pianoId": p.piano_id,
                "pianoType": p.piano_type,
                "timeTable": timeList,
                "pianoPlace": p.piano_room
            };
            pianolist.push(info);
        }
        ctx.response.body = {
            "success": true,
            "pianoList": pianolist
        };
    }
    //console.log(ctx.response.body);
}).post("/detail", async (ctx, next) => {
    console.log(ctx.request.body);
    let pianoId = ctx.request.body.pianoId;
    let dateStr = ctx.request.body.date;
    dateStr.concat(" 08:00:00");
    let result = await dataBase.GetPianoRoomInfo(pianoId, dateStr);
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "tableTime": null,
            "pianoPrices": null,
            "pianoInfo": null,
            "info":result.info
        };
    }
    else {
        let price = {
            "student": result.data.piano_stuvalue,
            "teacher": result.data.piano_teavalue,
            "society": result.data.piano_socvalue,
            "multi": result.data.piano_multivalue
        };
        let timeList = [];
        for(let i = 0; i<result.data.piano_list.length;i++)
        {
            timeList.push(result.data.piano_list[i] - '0');
        }
        ctx.response.body = {
            "success": true,
            "timeTable": timeList,
            "pianoPrices": price,
            "pianoInfo": result.data.piano_info
        };
    }
    //console.log(ctx.response.body);
}).post("/order", async (ctx, next) => {
    //todo:一个用户不能同时使用多个琴房
    console.log(ctx.request.body);
    let number = ctx.request.body.number;
    let userId = dataBase.GetSocietyUuidByTele(number);
    let userInfo = await dataBase.GetSocietyUserInfo(userId);
    if(userInfo.soc_type)
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