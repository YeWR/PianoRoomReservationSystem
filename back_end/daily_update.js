let file = require("fs");
let Db = require("mysql-activerecord");

let configFile = "mysqlConfig.json";
let config = JSON.parse(file.readFileSync(configFile));
const uuid = require("node-uuid");


let db = new Db.Adapter({
    server: config.serverIp,
    username: config.userName,
    password: config.passWord,
    database: config.dataBase,
    reconnectTimeout: config.TimeOut
});

let timeLength = 84;

let getDateStr = function (date) {
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

let doUpdate = async function(id,buffer, use){
    let checkUpdate = function(){
        return new Promise(resolve =>{
            db.where({piano_id: id}).update('piano',{piano_buffer:buffer, piano_list:use},function(err){
                if(err){
                    resolve(0);
                }
                else{
                    resolve(1);
                }
            });
        });
    };
    let check = await checkUpdate();
    if(check === 0){
        return 0;
    }
    else{
        return 1;
    }
}

// 每天23：00更新
let update = async function(){
    let now = new Date()
    let errorMsg = "";
    let pianoInfo;
    let test = function(){
        return new Promise(resolve =>{
            db.get('piano', function(err, rows, fields) {
                let _data = JSON.stringify(rows);
                pianoInfo = JSON.parse(_data);
                console.log(pianoInfo)
                let count = 0;
                for(let i = 0; i<pianoInfo.length; i++){
                    let buffer =  ""
                    for(let j = 1*timeLength; j<(pianoInfo[i].piano_buffer.data).length; j++){
                        if(pianoInfo[i].piano_buffer.data[j] == '0' || pianoInfo[i].piano_buffer.data[j] == 48){
                            buffer += '0';
                        }
                        else if(pianoInfo[i].piano_buffer.data[j] === '1' || pianoInfo[i].piano_buffer.data[j] == 49)
                        {
                            buffer += '1';
                        }
                        else{
                            buffer += '2';
                        }
                    }
                    for(let j = (now.getDay()-1)*timeLength; j<(now.getDay())*timeLength; j++){
                        if(pianoInfo[i].piano_rule.data[j] == '0' || pianoInfo[i].piano_rule.data[j] == 48){
                            buffer += '0'
                        }
                        else if(pianoInfo[i].piano_rule.data[j] === '1' || pianoInfo[i].piano_rule.data[j] == 49)
                        {
                            buffer += '1';
                        }
                        else{
                            buffer += '2'
                        }
                    }
                    let use = "";
                    for(let j = 1*timeLength; j<(pianoInfo[i].piano_list.data).length; j++){
                        if(pianoInfo[i].piano_list.data[j] == '0' || pianoInfo[i].piano_list.data[j] == 48){
                            use += '0'
                        }
                        else if(pianoInfo[i].piano_list.data[j] == '1' || pianoInfo[i].piano_list.data[j] == 49)
                        {
                            use += '1'
                        }
                        else{
                            use += '2'
                        }
                    }
                    for(let j = 2*timeLength; j<3*timeLength; j++){
                        if(buffer[j] == '0' || buffer[j] == 48){
                            use += '0'
                        }
                        else if(buffer[j] == '1' || buffer[j] == 49){
                            use += '1'
                        }
                        else{
                            use += '2'
                        }
                    }
                    db.where({piano_id: pianoInfo[i].piano_id}).update('piano',{piano_list:use},function(err){
                        count ++;
                        if(count == pianoInfo.length){
                            if(err){
                                resolve(0);
                            }
                            else{
                                resolve(1);
                            }
                        }
                    });
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"success":false,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"success":true};
    }
};

let InsertItem = async function(itemDate, itemUsername, itemRoomId, itemType, itemMember, itemValue, itemDuration, itemBegin, itemUuid){
    let errorMsg = "";
    //修改可预约时间段。
    let result = await preparePianoForInsert(itemRoomId, itemBegin, itemDuration, itemDate);
    if (result.success === false) {
        errorMsg = "预约失败";
        return {
            "success": false,
            "info": errorMsg
        };
    }
    //插入订单
    let test = function(){
        return new Promise(resolve =>{
            try{
                let _info = {
                    item_date: itemDate,
                    item_username: itemUsername,
                    item_roomId: itemRoomId,
                    item_type: itemType,
                    item_member: itemMember,
                    item_value: itemValue,
                    item_duration: itemDuration,
                    item_begin: itemBegin,
                    item_uuid: itemUuid
                }
                db.insert('item', _info, function (err, info) {
                    if(!err){
                        resolve(1);
                    }
                    else{
                        errorMsg = "新建订单失败";
                        resolve(0);
                    }
                });
            }
            catch{
                errorMsg = "预约失败";
                resolve(0);
            }
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag === 0){
        return {"success":false,
            "info":errorMsg};
    }
    if(flag === 1){
        return {"success":true};
    }
}

let getDateNum = function(itemDate){
    let item_date = new Date(itemDate);
    let now_date = new Date();
    //now_date.setHours(now_date.getHours()+8);
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

let preparePianoForInsert = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    itemBegin = timeLength*getDateNum(itemDate)+itemBegin;
    let itemEnd = itemBegin+itemDuration;
    let pianoInfo = null;
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
                    // change data
                    for(let i = itemBegin; i<itemEnd; i++){
                        if(pianoInfo.piano_list.data[i] === '1' || pianoInfo.piano_list.data[i] === 49
                            || pianoInfo.piano_list.data[i] === '2' || pianoInfo.piano_list.data[i] === 50){
                            resolve(0);
                        }
                    }
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag === 0){
        return {"success":false,
            "info":errorMsg};
    }
    if(flag === 1){
        // to do 更新数据
        let newList = "";
        let len = pianoInfo.piano_list.data.length;
        for(let i = 0; i<len; i++){
            if(i < itemEnd){
                if(i >= itemBegin){
                    newList += '1';
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
            return {"success":false,
                "info":errorMsg};
        }
        else{
            return {"success":true};
        }
    }
}

let SearchLongItem = async function(count, offset, userUuid, roomId, week, type){
    let errorMsg = "";
    let itemInfo = null;
    let itemCount = 0;
    let query = { item_long_userid: userUuid, item_long_pianoId: roomId, item_long_type: type, item_long_week: week, item_long_status: 1};
    for(let q in query)
    {
        if(query[q] === undefined || query[q] === null || query[q] === "")
        {
            delete query[q];
        }
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where(query)
                .limit(count, offset)
                .get('item_long', function (err, res, fields) {
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo = _info;
                    resolve(1);
                });
        });
    };
    let getItemCount = function(){
        return new Promise(resolve =>{
            db.where(query)
                .count('item_long', function (err, res, fields) {
                    itemCount = res;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let flagCount = await getItemCount();
    if(flag === 0){
        return {
            "data":itemInfo,
            "count": itemCount,
            "info":errorMsg};
    }
    if(flag === 1){
        return {"data":itemInfo,
            "count": itemCount,
            "info":errorMsg};
    }
};

let GetPianoRoomInfo = async function(pianoId) {
    let num = getDateNum(date);
    let errorMsg = "";
    let pianoInfo = null;
    let pianoInfoRes = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: pianoId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length === 0){
                    errorMsg = "琴房不存在";
                    resolve(0);
                }
                else{
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    pianoInfo = _info[0];
                    pianoInfoRes = [pianoInfo.piano_stuvalue,
                            pianoInfo.piano_teavalue,
                            pianoInfo.piano_socvalue,
                            pianoInfo.piano_multivalue]
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag === 0){
        return {"data":pianoInfoRes,
            "info":errorMsg};
    }
    if(flag === 1){
        return {"data":pianoInfoRes,
            "info":errorMsg};
    }
}

let InsertLongItem = async function () {
    let date = new Date();
    date = date + 2*24*60*60*1000;
    let dateStr = getDateStr(date);
    dateStr = dateStr.concat(" 08:00:00");
    let week = date.getDay();
    let items = SearchLongItem(2147483647,0,null,null,week,null);
    for(let item of items)
    {
        let price = await GetPianoRoomInfo(item.item_long_pianoId);
        let itemPrice = price.data[item.item_long_type] * Math.ceil((endIndex - startIndex) / 6);
        let itemUuid = uuid.v1().toString();
        itemUuid = itemUuid.replace(/\-/g,'');
        let result = await InsertItem(dateStr,item.item_long_userid,item.item_long_pianoId,-1,item.item_long_type,itemPrice,item.item_long_duration,item.item_long_begin,itemUuid);
    }
}
let run = async function()
{
    await update();
    await InsertLongItem();
}

run().then(val => {
    console.log("DailyUpdate Finish");
    process.exit();
});