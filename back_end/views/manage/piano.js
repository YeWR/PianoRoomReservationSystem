const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");

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
    ctx.response.status = 200;
}).post("/status", async (ctx, next) => {
    let request = ctx.request.body;
    if(request.status === 0)
    {
        for(let i = 0; i <= 2; i++)
        {
            let itemDate = new Date();
            itemDate.setDate(itemDate.getDate() - i);
            let result = await dataBase.SearchItem(1, 0, null, request.id, null,1,"+",getDateStr(itemDate));
            if(result.count !== 0)
            {
                ctx.response.status = 400;
                ctx.response.body = {"info": "该琴房仍有未生效订单，请联系用户处理！"};
                return;
            }
        }
    }
    let result = await dataBase.UpdatePianoInfo(request.id,null,null,null,null,null,null,null,request.status);
    ctx.response.status = 200;
}).post("/rule", async (ctx, next) => {
    let request = ctx.request.body;
    let startIndex = request.rule.start;
    let endIndex = request.rule.end;
    let day = dayCheck(request.rule.week);
    console.log("day:" + day.toString());
    let result = null;
    if (day >= 0)
    {
        let date = new Date();
        date.setDate(date.getDate() + day);
        let dateStr = getDateStr(date);
        result = await dataBase.preparePianoForInsert(request.id, startIndex, endIndex - startIndex, dateStr);
        if (!result.success) {
            ctx.response.status = 400;
            ctx.response.body = {"info": "与现有订单冲突，请联系用户处理！"};
            return;
        }
    }
    result = await dataBase.ChangePianoRule(request.id,startIndex, endIndex - startIndex,request.type);
    ctx.response.status = 200;
});

module.exports = routers;