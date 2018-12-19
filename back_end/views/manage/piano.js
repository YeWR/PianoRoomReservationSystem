const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const utils = require("../utils");

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
    let result = await dataBase.SearchPiano(limit, (page-1)*limit, query.room, query.roomType, null);
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
}).get("/detail", async (ctx, next) => {
    let id = ctx.query.id;
    let result = await dataBase.SearchPiano(1, 0, null, null, id);
    let pianoList = [];
    for(let piano of result.data)
    {
        let ruleList = [];
        for(let i = 0; i< piano.piano_rule.data.length;i++)
        {
            ruleList.push(piano.piano_rule.data[i] - 48);
        }
        let temp = {
            "id": piano.piano_id,
            "room": piano.piano_room,
            "type": piano.piano_type,
            "status": piano.piano_status,
            "stuValue": piano.piano_stuvalue,
            "teaValue": piano.piano_teavalue,
            "socValue": piano.piano_socvalue,
            "multiValue": piano.piano_multivalue,
            "disabled": ruleList,
            "info":piano.piano_info
        };
        pianoList.push(temp);
    }
    ctx.response.status = 200;
    ctx.response.body = {
        "items": pianoList,
        "total": result.count
    }
}).post("/create", async (ctx, next) => {
    let info = ctx.request.body;
    let result = await dataBase.InsertPiano(info.room, info.info, info.stuValue, info.teaValue, info.socValue, info.multiValue, info.type, info.status);
    if(result.success)
        ctx.response.status = 200;
    else
        ctx.response.status = 400;
}).post("/info", async (ctx, next) => {
    let request = ctx.request.body;
    let result = await dataBase.UpdatePianoInfo(request.id,request.room,request.info,request.stuValue,request.teaValue,request.socValue,request.multiValue,request.type,null);
    if(result.success)
        ctx.response.status = 200;
    else
        ctx.response.status = 400;
}).post("/status", async (ctx, next) => {
    let request = ctx.request.body;
    if(request.status == 0)
    {
        for(let i = 0; i <= 2; i++)
        {
            let itemDate = new Date();
            itemDate.setDate(itemDate.getDate() - i);
            let result = await dataBase.SearchItem(1, 0, null, request.id, null,1,"+",utils.getDateStr(itemDate));
            if(result.count !== 0)
            {
                ctx.response.status = 400;
                ctx.response.body = {"info": "该琴房仍有未生效订单，请联系用户处理！"};
                return;
            }
        }
    }
    let result = await dataBase.UpdatePianoInfo(request.id,null,null,null,null,null,null,null,request.status.toString());
    ctx.response.status = 200;
}).post("/rule", async (ctx, next) => {
    let request = ctx.request.body;
    console.log(request);
    let startIndex = request.start;
    let endIndex = request.end;
    let day = dayCheck(request.week);
    console.log("day:" + day.toString());
    let result = null;
    if (day >= 0 && request.type == 1)
    {
        let date = new Date();
        date.setDate(date.getDate() + day);
        let dateStr = utils.getDateStr(date);
        result = await dataBase.preparePianoForInsert(request.id, startIndex, endIndex - startIndex, dateStr);
        if (!result.success) {
            ctx.response.status = 400;
            ctx.response.body = {"info": "与现有订单冲突，请联系用户处理！"};
            return;
        }
    }
    result = await dataBase.ChangePianoRule(request.id,parseInt(startIndex), endIndex - startIndex,parseInt(request.week), request.type);
    console.log(result);
    ctx.response.status = 200;
});

module.exports = routers;