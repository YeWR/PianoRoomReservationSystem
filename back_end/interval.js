let file = require("fs");
let Db = require("mysql-activerecord");
const schedule = require('node-schedule');
let Redlock = require('redlock');
let configFile = "mysqlConfig.json";
let config = JSON.parse(file.readFileSync(configFile));

let db = new Db.Adapter({
    server: config.serverIp,
    username: config.userName,
    password: config.passWord,
    database: config.dataBase,
    reconnectTimeout: config.TimeOut
});

let redis = require("redis");
let client = redis.createClient(config.redisPort,config.serverIp);
let redlock = new Redlock([client]);
let timeLength = 84;
let totalTime = 5000;
let intervalTime = 50;

let sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

let GetItemByUuid = async function(itemUuid){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ item_uuid: itemUuid }).get('item', function (err, res, fields) {
                if(res.length === 0){
                    errorMsg = "订单不存在";
                    resolve(0);
                }
                else{
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo = _info[0];
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    if(flag === 0){
        return {"data":itemInfo,
            "info":errorMsg};
    }
    if(flag === 1){
        return {"data":itemInfo,
            "info":errorMsg};
    }
}

let getDateNum = function(itemDate){
    let item_date = new Date(itemDate);
    let now_date = new Date();
    if(now_date.getDate()>item_date.getDate()){
        return -1;
    }
    else if(now_date.getDate() === item_date.getDate()){
        return 0;
    }
    else{
        item_date.setDate(item_date.getDate()-1);
        if(now_date.getDate() === item_date.getDate()){
            return 1;
        }
        else{
            return 2;
        }
    }
}

// to do加上读写锁
let preparePianoForDel = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    let num = getDateNum(itemDate);
    if(num === -1){
        return {"success":true};
    }
    itemBegin = timeLength*num+itemBegin;
    let itemEnd = itemBegin+itemDuration;
    let lock = function(){
        return new Promise(async function(resolve){
            let tag = 0;
            for(let j = 0; j<200; j++){
                let key = itemRoomId.toString()+"prepareForDel";
                redlock.lock(key, totalTime).then(async function(lock){
                    if(tag === 1){
                        lock.unlock().catch(function(err){})
                    }
                    else{
                        tag = 1
                        let test = function(){
                            return new Promise(resolve =>{
                                db.where({ piano_id: itemRoomId }).get('piano', function (err, res, fields) {
                                    let _select = res;
                                    if(_select.length === 0){
                                        errorMsg = "琴房不存在";
                                        resolve(0);
                                    }
                                    else{
                                        let _data = JSON.stringify(_select);
                                        let _info = JSON.parse(_data);
                                        pianoInfo = _info[0];
                                        resolve(1);
                                    }
                                });
                            });
                        };
                        let flag = await test();
                        if(flag === 0){
                            lock.unlock().catch(function(err){})
                            resolve(0)
                            return ;
                        }
                        if(flag === 1){
                            // to do 更新数据
                            let newList = "";
                            let len = pianoInfo.piano_list.data.length;
                            for(let i = 0; i<len; i++){
                                if(i < itemEnd){
                                    if(i >= itemBegin){
                                        newList += '0';
                                        continue;
                                    }
                                }
                                if(pianoInfo.piano_list.data[i] === '0' || pianoInfo.piano_list.data[i] === 48){
                                    newList += '0';
                                }
                                else if(pianoInfo.piano_list.data[i] === '1' || pianoInfo.piano_list.data[i] === 49){
                                    newList += '1';
                                }
                                else
                                {
                                    newList += '2';
                                }
                            }
                            let checkUpdate = function(){
                                return new Promise(resolve =>{
                                    db.where({piano_id: itemRoomId}).update('piano',{piano_list:newList},function(err){
                                        if(err){
                                            resolve(0);
                                        }
                                        else{
                                            resolve(1);
                                        }
                                    });
                                });
                            };
                            let check = await checkUpdate()
                            if(check === 0){
                                errorMsg = "更新失败";
                                lock.unlock().catch(function(err){})
                                resolve(0)
                                return ;
                            }
                            else{
                                lock.unlock().catch(function(err){})
                                resolve(1)
                                return ;
                            }
                        }
                    }
                }).catch(()=>{})
                if(tag === 1){
                    break
                }
                await sleep(intervalTime);
            }
            if(tag === 0){
                errorMsg = "请求超时";
                resolve(0);
            }
        })
    }
    let res = await lock()
    if(res === 1){
        return {"success":true};
    }
    else{
        return {"success":false,
            "info":errorMsg};
    }
}

let DeleteItem = async function(itemUuid){
    // 更改piano数据
    let item = await GetItemByUuid(itemUuid);
    let errorMsg = "";
    let lock = function(){
        return new Promise(async function(resolve){
            let tag = 0;
            for(let j = 0; j<200; j++){
                let key = itemUuid.toString()+"itemDel";
                redlock.lock(key, totalTime).then(async function(lock){
                    if(tag === 1){
                        lock.unlock().catch(function(err){})
                    }
                    else{
                        tag = 1
                        let result = await preparePianoForDel(item.data.item_roomId, item.data.item_begin, item.data.item_duration, item.data.item_date);
                        if(result.success === false){
                            errorMsg = "退订失败";
                            lock.unlock().catch(function(err){})
                            resolve(0)
                            return ;
                        }
                        // 更新item数据
                        let test = function(){
                            return new Promise(resolve =>{
                                db.where({item_uuid: itemUuid }).update('item', {item_type: 0}, function (err) {
                                    if(!err){
                                        resolve(1);
                                    }
                                    else{
                                        errorMsg = "退订失败";
                                        resolve(0);
                                    }
                                });
                            });
                        };
                        let flag = await test();
                        if(flag === 0){
                            lock.unlock().catch(function(err){})
                            resolve(0)
                            return ;
                        }
                        if(flag === 1){
                            lock.unlock().catch(function(err){})
                            resolve(1)
                            return ;
                        }
                    }
                }).catch(()=>{})
                if(tag === 1){
                    break
                }
                await sleep(intervalTime);
            }
            if(tag === 0){
                errorMsg = "请求超时";
                resolve(0);
            }
        })
    }
    let res = await lock()
    if(res === 1){
        return {"success":true,
            "info":errorMsg};
    }
    else{
        return {"success":false,
            "info":errorMsg};
    }
}


let SearchUnpaidItemAndDelete = async function(){
    let itemInfo1 = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where('item_type', [0,3])
                .get('item', function (err, res, fields) {
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo1 = _info;
                    resolve(1);
                });
        });
    };
    let flag1 = await test();
    let current = new Date().getTime();
    for(let i of itemInfo1)
    {
        let orderTime = new Date(i.item_time);
        orderTime = orderTime.getTime();
        if(current - orderTime > 30*60*1000) {
            let result = DeleteItem(i.item_uuid);
            console.log(i.item_uuid);
        }
    }

};

let SearchUnpaidLongItemAndDelete = async function(){
    let itemInfo2 = null;
    let test2 = function(){
        return new Promise(resolve =>{
            db.where('item_type', [0,-1])
                .get('item', function (err, res, fields) {
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo2 = _info;
                    resolve(1);
                });
        });
    };
    let current = new Date().getTime();
    let flag2 = await test2();
    for(let i of itemInfo2)
    {
        let orderTime = new Date(i.item_date);
        orderTime.setHours(8+Math.floor(i.item_begin/6));
        orderTime.setMinutes(10*(i.item_begin%6));
        orderTime.setSeconds(0,0);
        if(orderTime.getTime() - current < 30*60*1000) {
            let result = await DeleteItem(i.item_uuid);
            console.log(i.item_uuid);
        }
    }
};

let run = async function()
{
    await SearchUnpaidItemAndDelete();
    await SearchUnpaidLongItemAndDelete();
}

run().then(val => {
    console.log(new Date());
    console.log("Autodelete Finish");
    process.exit();
});