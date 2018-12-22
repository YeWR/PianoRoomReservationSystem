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
    if(request.status === 0)
    {
        console.log("check");
        for(let i = 0; i <= 2; i++)
        {
            let itemDate = new Date();
            itemDate.setDate(itemDate.getDate() + i);
            let result = await dataBase.SearchItem(100, 0, null, request.id, null,[1],"+",null);
            console.log(result);
            if(result.count !== 0)
            {
                ctx.response.status = 400;
                ctx.response.body = {"info": "该琴房仍有未使用订单，请联系用户处理！"};
                return;
            }
        }
    }
    let result = await dataBase.UpdatePianoInfo(request.id,null,null,null,null,null,null,null,request.status);
    if(result.success)
        ctx.response.status = 200;
    else
        ctx.response.status = 400;
}).post("/rule", async (ctx, next) => {
    let request = ctx.request.body;
    console.log("rule");
    console.log(request);
    let startIndex = request.start;
    let endIndex = request.end;
    let day = dayCheck(request.week);
    let result = null;
    if(request.type === 2) //添加规则
    {
        //检查长期预约
        result = await dataBase.SearchLongItem(2147483647,0,null,request.id,request.week,null);
        if(result.count > 0)
        {
            for(let i in result.data)
            {
                if(i.item_long_begin > endIndex && (i.item_long_begin+i.item_long_duration) < startIndex)
                {
                    ctx.response.status = 400;
                    ctx.response.body = {"info": "与现有长期预约冲突，请联系用户处理！"};
                    return;
                }
            }
        }
        //检查3天内订单
        if (day >= 0)
        {
            let date = new Date();
            date.setDate(date.getDate() + day);
            let dateStr = utils.getDateStr(date);
            result = await dataBase.preparePianoForRule(request.id, startIndex, endIndex - startIndex, dateStr);
            if (!result.success) {
                ctx.response.status = 400;
                ctx.response.body = {"info": "与现有订单冲突，请联系用户处理！"};
                return;
            }
        }
    }
    else if(request.type === 0) //删除规则
    {
        if (day >= 0)
        {
            let date = new Date();
            date.setDate(date.getDate() + day);
            let dateStr = utils.getDateStr(date);
            result = await dataBase.preparePianoForDel(request.id, startIndex, endIndex - startIndex, dateStr);
        }
    }
    result = await dataBase.ChangePianoRule(request.id,parseInt(startIndex), endIndex - startIndex,parseInt(request.week), request.type);
    if (!result.success) {
        ctx.response.status = 400;
        ctx.response.body = {"info": "修改规则失败,请联系开发人员"};
        return;
    }
    ctx.response.status = 200;
}).post("/ruleChange", async (ctx, next) => {
    let request = ctx.request.body;
    console.log("ruleChange");
    console.log(request);
    let oldstartIndex = request.oldStart;
    let oldendIndex = request.oldEnd;
    let newstartIndex = request.newStart;
    let newendIndex = request.newEnd;
    let day = dayCheck(request.week);
    console.log("day:" + day.toString());
    let result = null;
    //删除旧规则
    if (day >= 0)
    {
        let date = new Date();
        date.setDate(date.getDate() + day);
        let dateStr = utils.getDateStr(date);
        result = await dataBase.preparePianoForDel(request.id, oldstartIndex, oldendIndex - oldstartIndex, dateStr);
    }
    result = await dataBase.ChangePianoRule(request.id,parseInt(oldstartIndex), oldendIndex - oldstartIndex,parseInt(request.week), 0);
    if (!result.success) {
        ctx.response.status = 400;
        ctx.response.body = {"info": "修改规则失败,请联系开发人员"};
        return;
    }
    //检查新规则
    //检查长期预约
    result = await dataBase.SearchLongItem(2147483647,0,null,request.id,request.week,null);
    if(result.count > 0)
    {
        for(let i in result.data)
        {
            if(i.item_long_begin > newendIndex && (i.item_long_begin+i.item_long_duration) < newstartIndex)
            {
                //写回旧规则
                result = await dataBase.preparePianoForRule(request.id, oldstartIndex, oldendIndex - oldstartIndex, dateStr);
                result = await dataBase.ChangePianoRule(request.id,parseInt(oldstartIndex), oldendIndex - oldstartIndex,parseInt(request.week), 2);
                ctx.response.status = 400;
                ctx.response.body = {"info": "与现有长期预约冲突，请联系用户处理！"};
                return;
            }
        }
    }
    //检查3天内订单
    if (day >= 0)
    {
        let date = new Date();
        date.setDate(date.getDate() + day);
        let dateStr = utils.getDateStr(date);
        result = await dataBase.preparePianoForRule(request.id, newstartIndex, newendIndex - newstartIndex, dateStr);
        if (!result.success) {
            //写回旧规则
            result = await dataBase.preparePianoForRule(request.id, oldstartIndex, oldendIndex - oldstartIndex, dateStr);
            result = await dataBase.ChangePianoRule(request.id,parseInt(oldstartIndex), oldendIndex - oldstartIndex,parseInt(request.week), 2);
            ctx.response.status = 400;
            ctx.response.body = {"info": "与现有订单冲突，请联系用户处理！"};
            return;
        }
    }
    //插入新规则
    result = await dataBase.ChangePianoRule(request.id,parseInt(newstartIndex), newendIndex - newstartIndex,parseInt(request.week), 2);
    if (!result.success) {
        ctx.response.status = 400;
        ctx.response.body = {"info": "修改规则失败,请联系开发人员"};
        return;
    }
    ctx.response.status = 200;
});

module.exports = routers;