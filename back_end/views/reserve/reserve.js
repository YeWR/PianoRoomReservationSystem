const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/all", async (ctx, next) => {
    console.log(ctx.request.body);
    let result = await dataBase.GetPianoRoomAll();
    if(result.data === null)
    {
        ctx.response.body = {"pianoList": null, "errorMsg":result.info};
    }
    else
    {
        let pianolist = [];
        for(p of result.data) {
            let info = {
                "pianoId": p.piano_id,
                "pianoType": p.piano_type,
                "timeTable": p.piano_list,
                "pianoPlace": p.piano_room
            };
            pianolist.push(info);
        }
        ctx.response.body = {"pianoList": pianolist};
    }
    console.log(ctx.response.body);
}).post("/detail", async (ctx, next) => {
    console.log(ctx.request.body);
    let pianoId = ctx.request.body.pianoId;
    let dateStr = ctx.request.body.date;
    dateStr.concat(" 08:00:00");
    let result = await dataBase.GetPianoRoomInfo(pianoId, dateStr);
    if(result.data === null)
    {
        ctx.response.body = {"tableTime": null, "pianoPrices": null, "pianoInfo": null, "errorMsg":result.info};
    }
    else {
        let price = {
            "student": result.data.piano_stuvalue,
            "teacher": result.data.piano_teavalue,
            "society": result.data.piano_socvalue,
            "multi": result.data.piano_multivalue
        };
        ctx.response.body = {
            "timeTable": result.data.piano_list,
            "pianoPrices": price,
            "pianoInfo": result.data.piano_info
        };
    }
    console.log(ctx.response.body);
}).post("/order", async (ctx, next) => {
    console.log(ctx.request.body);
    let phoneNumber = ctx.request.body.phoneNumber;
    let pianoId = ctx.request.body.pianoId;
    let userType = ctx.request.body.userType;
    let pianoPrice = ctx.request.body.pianoPrice;
    let begTimeIndex = ctx.request.body.begTimeIndex;
    let endTimeIndex = ctx.request.body.endTimeIndex;
    let dateStr = ctx.request.body.date;
    dateStr.concat(" 08:00:00");
    let duration = endTimeIndex - begTimeIndex;
    let result = await dataBase.InsertItem(dateStr,phoneNumber,pianoId,1,userType,pianoPrice,duration,begTimeIndex);
    ctx.response.body = result;
    console.log(ctx.response.body);
});

module.exports = routers;