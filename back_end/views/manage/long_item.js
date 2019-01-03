const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const utils = require("../utils");

const routers = router.get("/list", async (ctx, next) => {
    let query = ctx.query;
    console.log(query);
    let page = query.page;
    let limit = parseInt(query.limit);
    let userId = ctx.query.number;
    if(ctx.query.number)
    {
        let uuid = await dataBase.GetUserUuidByNumber(ctx.query.number);
        if(uuid.data)
            userId = uuid.data;
    }
    if(query.room)
    {
        let roomResult = await dataBase.SearchPiano(1,0,query.room,null,null);
        if(roomResult.count)
        {
            query.room = roomResult.data[0].piano_id;
        }
    }
    let result = await dataBase.SearchLongItem(limit, (page-1)*limit,userId,query.room,query.week,query.type);
    for(let i of result.data)
    {
        let user = await dataBase.GetUserInfo(i.item_long_userid);
        let piano = await dataBase.SearchPiano(1,0,null,null,i.item_long_pianoId);
        i.item_long_userid = user.data.number;
        i.item_long_pianoId = piano.data[0].piano_room;
    }
    console.log(result);
    ctx.response.status = 200;
    ctx.response.body = {
        "items": result.data,
        "count": result.count,
        "info": result.info
    };
}).post("/create", async (ctx, next) => {
    let request = ctx.request.body;
    request.end = parseInt(request.end);
    request.start = parseInt(request.start);
    console.log("createLong");
    console.log(request);
    //检查用户
    // 用户被加黑名单
    let userId = await dataBase.GetUserUuidByNumber(request.id);
    let userInfo = null;
    if(userId.data)
    {
        userId = userId.data;
        userInfo = await dataBase.GetUserInfo(userId);
        userInfo = userInfo.data;
        if(userInfo.status === 0)
        {
            ctx.response.status = 400;
            ctx.response.body = {
                "info": "用户在黑名单中"
            };
            return;
        }
    }
    else
    {
        ctx.response.status = 400;
        ctx.response.body = {
            "info": "用户不存在"
        };
        return;
    }
    //检查琴房
    let roomResult = await dataBase.SearchPiano(1,0,request.room,null,null);
    if(roomResult.count)
    {
        request.room = roomResult.data[0].piano_id;
    }
    else
    {
        ctx.response.status = 400;
        ctx.response.body = {
            "info": "琴房不存在"
        };
        return;
    }
    let lock = function(){
        return new Promise(async function(resolve){
            let tag = 0;
            for(let j = 0; j<200; j++){
                let key = request.room+"piano";
                dataBase.redlock.lock(key, dataBase.totalTime).then(async function(lock){
                    if(tag === 1){
                        lock.unlock().catch(function(err){})
                    }
                    else{
                        tag = 1
                        // to do
                        //检查现有长期预约
                        let longItemResult = await dataBase.SearchLongItem(2147483647,0,null,request.room,request.week,null);
                        for(let i of longItemResult.data)
                        {
                            if(i.item_long_begin < request.end && (i.item_long_begin+i.item_long_duration) > request.start)
                            {
                                ctx.response.status = 400;
                                ctx.response.body = {
                                    "info": "与现有长期预约冲突!"
                                };
                                lock.unlock().catch(function(err){})
                                resolve(0)
                                return;
                            }
                        }
                        //检查规则
                        let result = await dataBase.CheckPianoRule(request.room,request.start,request.end-request.start,request.week);
                        console.log(result);
                        if(result.success)
                        {
                            let type = 0;
                            if(request.type === 0 || request.type === '0')
                            {
                                type = userInfo.type;
                            }
                            else
                            {
                                type = 3; //多人
                            }
                            //添加长期预约
                            await dataBase.AddLongItem(userId,type,request.room,request.week,request.start,request.end-request.start);
                            ctx.response.status = 200;
                            lock.unlock().catch(function(err){})
                            resolve(1)
                            return;
                        }
                        else
                        {
                            ctx.response.status = 400;
                            ctx.response.body = {
                                "info": "与琴房可用时间冲突!"
                            };
                            lock.unlock().catch(function(err){})
                            resolve(0)
                            return;
                        }
                    }
                }).catch(()=>{})
                if(tag === 1){
                    break
                }
                await dataBase.sleep(dataBase.intervalTime)
            }
            if(tag === 0){
                ctx.response.status = 400;
                ctx.response.body = {
                    "info": "请求超时!"
                };
                resolve(0)
                return ;
            }
        })
    }
    let res = await lock()
}).post("/delete", async (ctx, next) => {
    let id = ctx.request.body.id;
    let result = await dataBase.DeleteLongItem(id);
    if(result.success)
    {
        ctx.response.status = 200;
    }
    else
    {
        ctx.response.status = 400;
        ctx.response.body = {
            "info": result.info
        };
    }
});

module.exports = routers;