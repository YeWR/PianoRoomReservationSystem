const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");


function dayCheck(day) {
    let today = new Date().getDay();
    switch (today)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            if(day - today > 2 || day -today < 0)
                return -1;
            else
                return day - today;
        case 5:
        case 6:
            if(day < 5)
                day = day + 7;
            if(day - today > 2)
                return -1;
            else
                return day - today;
    }

}

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    let page = 1;
    if(query.page)
    {
        page = parseInt(query.page);
    }
    let limit = 20;
    if(query.limit)
    {
        limit = parseInt(query.limit);
    }
    let result = await dataBase.SearchPiano(limit, (page-1)*limit, query.room, query.roomType);
    let pianoList = [];
    for(let piano of result.data)
    {
        let temp = {
            "id": piano.piano_id,
            "room": piano.piano_room,
            "type": piano.piano_type,
            "status": piano.piano_status,
            "stuValue": piano.piano_stuvalue,
            "teaValue": piano.piano_teavalue,
            "socValue": piano.piano_socvalue,
            "multiValue":piano.piano_multivalue,
            "info":piano.piano_info
        };
        pianoList.push(temp);
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "items": pianoList,
        "total": result.count
    }
}).get("/deatil", async (ctx, next) => {
    let query = ctx.query.id;
    ctx.response.status = 200;
}).post("/update", async (ctx, next) => {
    let id = ctx.request.body.id;
    let result = await dataBase.DeleteNotice(id);
    ctx.response.status = 200;
}).post("/set", async (ctx, next) => {
    let week = ctx.request.body.week;
    let id = ctx.request.body.id;
    let startIndex = 0;
    let endIndex = 0;
    let day = dayCheck(week);
    //if(day > 0)
    //{
    //    let date = new Date();
    //    date
    //    let result = await dataBase.preparePianoForInsert(id, startIndex, endIndex - startIndex, date)
    //}
    let result = await dataBase.DeleteNotice(id);
    ctx.response.status = 200;
});

module.exports = routers;