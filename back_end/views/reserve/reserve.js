const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.get("/all", async (ctx, next) => {
    let result = await dataBase.GetPianoRoomAll();
    if(result.data === null)
    {
        ctx.response.body = {"pianoList": null, "errorMsg":result.info};
    }
    else
    {
        let pianolist = new Array();
        for(p of result.data) {
            let info = {
                "pianoId": p.piano_id,
                "pianoType": p.piano_type,
                "timeTable": p.piano_list,
                "pianoPlace": p.piano_room
            };
            pianolist.push(info);
        }
        ctx.response.body = {"pianoList": pianolist };
    }
    console.log(result);

}).get("/detail", async (ctx, next) => {
    let pianoId = ctx.request.body.pianoId;
    let result = await dataBase.GetPianoRoomInfo(pianoId);
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
    console.log(result);
}).post("/order", async (ctx, next) => {
    let phoneNumber = ctx.request.body.phoneNumber;
    let pianoId = ctx.request.body.pianoId;
    let userType = ctx.request.body.userType;
    let pianoPrice = ctx.request.body.pianoPrice;
    let begTimeIndex = ctx.request.body.begTimeIndex;
    let endTimeIndex = ctx.request.body.endTimeIndex;
    let date = new Date();
    date.setSeconds(0,0);
    let starthour = 8;
    date.setHours(Math.floor(begTimeIndex/6)+starthour, begTimeIndex%6*10, 0,0);
    let duration = endTimeIndex - begTimeIndex;
    let result = await dataBase.InsertItem(date,phoneNumber,pianoId,1,userType,pianoPrice,duration);
    ctx.response.body = result;
});

module.exports = routers;