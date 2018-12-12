let file = require("fs");
let Db = require("mysql-activerecord");

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
let client = redis.createClient(config.redisPort,config.serverIp)

let timeLength = 84;

let ChangeSocietyType = async function(userUuid, userType){
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({soc_uuid: userUuid }).update('society_user', {soc_type: userType}, function (err) {
                if(err == null){
                    resolve(1);
                }
                else{
                    errorMsg = "更改失败";
                    resolve(0);
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
}

// uuid:改为使用uuid
let GetSocietyUuidByTele = async function(userTele){
    let errorMsg = "";
    let userInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: userTele }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length == 0) {
                    errorMsg = "用户不存在"; // to do
                    resolve(0);
                }
                else {
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    userInfo = _info[0];
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":userInfo,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":userInfo.soc_uuid};
    }
}

let SearchSocietyUser = async function(count, offset, soc_tele, soc_realname, soc_id, soc_type){
    let errorMsg = "";
    let userInfo = null;
    let userCount = 0;
    let query = { soc_tele: soc_tele, soc_realname: soc_realname, soc_id: soc_id, soc_type: soc_type};
    for(let q in query)
    {
        if(!query[q])
        {
            delete query[q];
        }
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where(query)
                .limit(count,offset)
                .get('society_user', function (err, res, fields) {
                let _select = res;
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    userInfo = _info;
                    resolve(1);
            });
        });
    };
    let getUserCount = function(){
        return new Promise(resolve =>{
            db.where(query)
                .count('society_user', function (err, res, fields) {
                    userCount = res;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let flagCount = await getUserCount();
    console.log(flag);
    if(flag == 0){
        return {"data":userInfo,
            "count": userCount,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":userInfo,
        "count": userCount};
    }
}

// uuid:改为使用uuid
let GetSocietyUserInfo = async function(userUuid){
    let errorMsg = "";
    let userInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_uuid: userUuid }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length == 0) {
                    errorMsg = "用户不存在"; // to do
                    resolve(0);
                }
                else {
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    userInfo = _info[0];
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":userInfo,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":userInfo};
    }
}

// to do check tele
let SetRegisterMsg = async function(socTele, socPassword) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: socTele }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length != 0) {
                    errorMsg = "手机号已经被使用"; // to do 
                    resolve(0);
                }
                else {
                    try{
                        client.set(socTele, socPassword);
                        client.expire(socTele, 60);
                        resolve(1);
                    }
                    catch(err){
                        errorMsg = "发送失败";
                        resolve(0);
                    }
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
}
// uuid:增加参数uuid
let SocietyRegister = async function(socType, socId, socRealname, socTele, socUuid,socPassword) {
    let errorMsg = "";
    let checkMsg = function(){
        return new Promise(resolve =>{
            client.get(socTele, function(err, reply){
                if(reply){
                    if(socPassword == (reply.toString())){
                        client.del(socTele, function (err, reply) {});
                        resolve(1);
                    }
                    else{
                        errorMsg = "验证码错误";
                        resolve(0);
                    }
                }
                else{
                    errorMsg = "请先发送验证码";
                    resolve(0);
                }
            });
        });
    };
    let res = await checkMsg();
    console.log(res);
    if(res == 0){
        return {"success":false,
                "info":errorMsg};
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: socTele }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length != 0) {
                    errorMsg = "手机号已经被使用"; // to do 
                    resolve(0);
                }
                else {
                    let _info = {
                        soc_type: socType,
                        soc_id: socId,
                        soc_realname: socRealname,
                        soc_tele: socTele,
                        soc_uuid: socUuid
                    };
                    db.insert('society_user', _info, function (err, info) {
                        if(err == null){
                            resolve(1);
                        }
                        else{
                            errorMsg = "新建用户失败";
                            resolve(0);
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
}

// to do check tele
let SetLoginMsg = async function(socTele, socPassword) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: socTele }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length == 0) {
                    errorMsg = "手机号未注册"; // to do 
                    resolve(0);
                }
                else {
                    try{
                        client.set(socTele, socPassword);
                        client.expire(socTele, 60);
                        resolve(1);
                    }
                    catch(err){
                        errorMsg = "发送失败";
                        resolve(0);
                    }
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
}

// to do check if already online
let SocietyLogin = async function(socTele, socPassword) {
    let errorMsg = "";
    let getUser = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: socTele }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length == 0) {
                    errorMsg = "手机号未注册"; // to do 
                    resolve(0);
                }
                else {
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    user = _info[0];
                    //console.log(user);
                    resolve(user.soc_realname);
                }
            });
        });
    };
    let realName = await getUser();
    if(realName == 0){
        return {"success":false,
                "data": realName,
                "info":errorMsg};
    }
    let test = function(){
        return new Promise(resolve =>{
            client.get(socTele, function(err, reply){
                if(reply){
                    if(socPassword == (reply.toString())){
                        client.del(socTele, function (err, reply) {});
                        resolve(1);
                    }
                    else{
                        errorMsg = "验证码错误";
                        resolve(0);
                    }
                }
                else{
                    errorMsg = "请先发送验证码";
                    resolve(0);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"success":false,
                "data":realName,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"success":true,
                "data":realName};
    }
}

let InsertPiano = async function(pianoRoom, pianoInfo, pianoStuvalue, pianoTeavalue, pianoSocvalue, pianoMultivalue, pianoType, pianoStatus) {
    let errorMsg = "";
    let pianoList = "0".repeat(84*3);
    let pianoRule = "0".repeat(84*7);
    let test = function(){
        return new Promise(resolve =>{
            let _info = {
                piano_list: pianoList,
                piano_room: pianoRoom,
                piano_info: pianoInfo,
                piano_stuvalue: pianoStuvalue,
                piano_socvalue: pianoSocvalue,
                piano_teavalue: pianoTeavalue,
                piano_multivalue: pianoMultivalue,
                piano_type: pianoType,
                piano_status: pianoStatus,
                piano_rule: pianoRule
            };
            db.insert('piano', _info, function (err, info) {
                if(err == null){
                    resolve(1);
                }
                else{
                    errorMsg = "新建琴房失败";
                    resolve(0);
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
}

let UpdatePianoInfo = async function(pianoId, pianoRoom, pianoInfo, pianoStuvalue, pianoTeavalue, pianoSocvalue, pianoMultivalue, pianoType, pianoStatus) {
    let errorMsg = "";
    let info = {
        piano_room: pianoRoom,
        piano_info: pianoInfo,
        piano_stuvalue: pianoStuvalue,
        piano_socvalue: pianoSocvalue,
        piano_teavalue: pianoTeavalue,
        piano_multivalue: pianoMultivalue,
        piano_type: pianoType,
        piano_status: pianoStatus,
    };
    for(let i in info)
    {
        if(!info[i])
        {
            delete info[i];
        }
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: pianoId }).update('piano', info, function (err, res, fields) {
                if(err === null)
                    resolve(1);
                else
                {
                    errorMsg = "修改琴房信息失败";
                    resolve(0);
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

let GetPianoRoomAll = async function(){
    let errorMsg = "";
    let pianoInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.get('piano', function(err, rows, fields) { 
                let _data = JSON.stringify(rows);
                pianoInfo = JSON.parse(_data);
                resolve(1);
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":pianoInfo,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"data":pianoInfo,
                "info":errorMsg};
    }
};

let SearchPiano = async function(count, offset, piano_room, piano_type, piano_id){
    let errorMsg = "";
    let pianoInfo = null;
    let pianoCount = 0;
    let query = { piano_room: piano_room, piano_type: piano_type, piano_id: piano_id};
    for(let q in query)
    {
        if(!query[q])
        {
            delete query[q];
        }
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where(query)
                .limit(count,offset)
                .get('piano', function(err, rows, fields) {
                let _data = JSON.stringify(rows);
                pianoInfo = JSON.parse(_data);
                resolve(1);
            });
        });
    };
    let getPianoCount = function(){
        return new Promise(resolve =>{
            db.where(query)
                .count('piano', function (err, res, fields) {
                    pianoCount = res;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let flagCount = await getPianoCount();
    console.log(flag);
    if(flag == 0){
        return {"data":pianoInfo,
            "count": pianoCount,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":pianoInfo,
            "count": pianoCount,
            "info":errorMsg};
    }
};

let getDateNum = function(itemDate){
    let item_date = new Date(itemDate);
    let now_date = new Date();
    now_date.setHours(now_date.getHours()+8);
    if(now_date>item_date){
        item_date.setDate(item_date.getDate()+1);
        if(now_date > item_date){
            return -1;
        }
        return 0;
    }
    else{
        item_date.setDate(item_date.getDate()-1);
        if(now_date>item_date){
            return 1;
        }
        else{
            return 2;
        }
    }
}

let GetPianoRoomInfo = async function(pianoId, date) {
    let num = getDateNum(date);
    let errorMsg = "";
    let pianoInfo = null;
    let pianoInfoRes = null;
    let pianoList = [];
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: pianoId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
                    errorMsg = "琴房不存在";
                    resolve(0);
                }
                else{
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    pianoInfo = _info[0];
                    
                    for(let i = num*timeLength; i<(num+1)*timeLength; i++){
                        if(pianoInfo.piano_list.data[i] == 48){
                            pianoList.push(0);
                        }
                        if(pianoInfo.piano_list.data[i] == 49){
                            pianoList.push(1);
                        }
                    }
                    pianoInfoRes = {
                        "piano_list": pianoList,
                        "piano_id": pianoInfo.piano_id,
                        "piano_room": pianoInfo.piano_room,
                        "piano_picurl": pianoInfo.piano_picurl,
                        "piano_info": pianoInfo.piano_info,
                        "piano_stuvalue": pianoInfo.piano_stuvalue,
                        "piano_teavalue": pianoInfo.piano_teavalue,
                        "piano_socvalue": pianoInfo.piano_socvalue,
                        "piano_multivalue": pianoInfo.piano_multivalue,
                        "piano_type": pianoInfo.piano_type
                    }
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":pianoInfoRes,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"data":pianoInfoRes,
                "info":errorMsg};
    }
}

// to do加上读写锁
let preparePianoForInsert = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    itemBegin = timeLength*getDateNum(itemDate)+itemBegin;
    let itemEnd = itemBegin+itemDuration;
    let pianoInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: itemRoomId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
                    errorMsg = "琴房不存在";
                    resolve(0);
                }
                else{
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    pianoInfo = _info[0];
                    // change data
                    for(let i = itemBegin; i<itemEnd; i++){
                        if(pianoInfo.piano_list.data[i] == '1' || pianoInfo.piano_list.data[i] == 49){
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
    if(flag == 0){
        return {"success":false,
                "info":errorMsg};
    }
    if(flag == 1){
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
            if(pianoInfo.piano_list.data[i] == '0' || pianoInfo.piano_list.data[i] == 48){
                newList += '0';
            }
            else{
                newList += '1';
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
        if(check == 0){
            errorMsg = "更新失败";
            return {"success":false,
                    "info":errorMsg};
        }
        else{
            return {"success":true};
        }
    }
}

let ChangePianoRule = async function(itemRoomId, itemBegin, itemDuration, itemDay, ruleType){
    let errorMsg = "";
    itemBegin = timeLength*itemDay+itemBegin;
    let itemEnd = itemBegin+itemDuration;
    let pianoInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: itemRoomId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
                    errorMsg = "琴房不存在";
                    resolve(0);
                }
                else
                {
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    pianoInfo = _info[0];
                    resolve(1);
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
        let newList = "";
        let len = pianoInfo.piano_rule.data.length;
        for(let i = 0; i<len; i++){
            if(i < itemEnd){
                if(i >= itemBegin){
                    newList += ruleType.toString();
                    continue;
                }
            }
            if(pianoInfo.piano_rule.data[i] == '0' || pianoInfo.piano_rule.data[i] == 48){
                newList += '0';
            }
            else{
                newList += '1';
            }
        }
        let checkUpdate = function(){
            return new Promise(resolve =>{
                db.where({piano_id: itemRoomId}).update('piano',{piano_rule:newList},function(err){
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
        if(check == 0){
            errorMsg = "更新失败";
            return {"success":false,
                "info":errorMsg};
        }
        else{
            return {"success":true};
        }
    }
}

// uuid: itemUsername 传入uuid
// begin is the begin index, duration is the length
let InsertItem = async function(itemDate, itemUsername, itemRoomId, itemType, itemMember, itemValue, itemDuration, itemBegin, itemUuid){
    let errorMsg = "";
    // 修改可预约时间段。
    let result = await preparePianoForInsert(itemRoomId, itemBegin, itemDuration, itemDate);
    if (result.success === false) {
        errorMsg = "预约失败";
        return {
            "success": false,
            "info": errorMsg
        };
    }
    // 插入订单
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
                    console.log(err);
                    if(err == null){
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
    if(flag == 0){
        return {"success":false,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"success":true};
    }
}

//使用redis存储未支付订单
let InsertTempItem = async function(itemDate, itemUsername, itemRoomId, itemType, itemMember, itemValue, itemDuration, itemBegin, itemUuid){
    let errorMsg = "";
    // 插入订单
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
                client.set(itemUuid, JSON.stringify(_info));
                client.expire(itemUuid, 3600);
                resolve(1);
            }
            catch{
                errorMsg = "预约失败";
                resolve(0);
            }
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
}

let DeleteTempItem = async function(itemUuid){
    let errorMsg = "";
    // 插入订单
    let test = function(){
        return new Promise(resolve =>{
            try{
                client.del(itemUuid, function (err, reply) {});
                resolve(1);
            }
            catch{
                resolve(0);
            }
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
}

let ItemCheckin = async function(itemUuid){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ item_uuid: itemUuid }).get('item', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0)
                {
                    errorMsg = "订单不存在";
                    resolve(0);
                }
                else
                {
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    itemInfo = _info[0];
                    if(itemInfo.item_type === 2)
                    {
                        errorMsg = "订单已使用";
                        resolve(0);
                    }
                    else if(itemInfo.item_type === 0)
                    {
                        errorMsg = "订单已取消";
                        resolve(0);
                    }
                    else
                    {
                        resolve(1);
                    }
                }
            });
        });
    };
    let checkin = function(){
        return new Promise(resolve =>{
            db.where({ item_uuid: itemUuid }).update('item',{item_type:2},function(err){
                if(err){
                    errorMsg = "检票失败";
                    resolve(0);
                }
                else{
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"success": false,
            "info":errorMsg};
    }
    if(flag == 1){
        flag = await checkin();
        if(flag == 0){
            return {"success": false,
                "info":errorMsg};
        }
        if(flag == 1){
            return {"data":itemInfo,
                "success": true};
        }
    }
};

// uuid: 使用用户的uuid
let GetItem = async function(itemUsername){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ item_username: itemUsername }).get('item', function (err, res, fields) {
                let _data = JSON.stringify(res);
                let _info = JSON.parse(_data);
                itemInfo = _info;
                resolve(1);
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":itemInfo,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"data":itemInfo,
                "info":errorMsg};
    }
}

let SearchItem = async function(count, offset, username, roomId, member, type, order, date){
    let errorMsg = "";
    let itemInfo = null;
    let itemCount = 0;
    let dateQuery = "item_date IS NOT NULL";
    if(typeof date === 'string')
    {
        dateQuery = "DATE_FORMAT(item_date, \'%Y-%m-%d\') = \'" + date + "\'";
    }
    else if(typeof date === 'number')
    {
        dateQuery = "DATE_SUB(CURDATE(), INTERVAL " + date.toString() + " DAY) <= date(item_date)";
    }
    let query = { item_username: username, item_roomId: roomId, item_member: member};
    for(let q in query)
    {
        if(!query[q])
        {
            delete query[q];
        }
    }
    let sortOrder = null;
    if(order === '-')
    {
        sortOrder = ['`item_date` asc', '`item_begin` asc'];
    }
    else
    {
        sortOrder = ['`item_date` desc', '`item_begin` desc'];
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where(query)
                .where(dateQuery)
                .where('item_type', type)
                .limit(count, offset)
                .order_by(sortOrder)
                .get('item', function (err, res, fields) {
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
                .where('item_type', type)
                .count('item', function (err, res, fields) {
                    itemCount = res;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let flagCount = await getItemCount();
    if(flag == 0){
        return {"data":itemInfo,
            "count": itemCount,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":itemInfo,
            "count": itemCount,
            "info":errorMsg};
    }
};

let GetItemByUuid = async function(itemUuid){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ item_uuid: itemUuid }).get('item', function (err, res, fields) {
                if(res.length == 0){
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
    console.log(flag);
    if(flag == 0){
        return {"data":itemInfo,
                "info":errorMsg};
    }
    if(flag == 1){
        console
        return {"data":itemInfo,
                "info":errorMsg};
    }
}

let GetTempItemByUuid = async function(itemUuid){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            client.get(itemUuid, function(err, reply){
                if(reply){
                    itemInfo = JSON.parse(reply);
                    resolve(1);
                }
                else{
                    errorMsg = "无此订单";
                    resolve(0);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":itemInfo,
            "info":errorMsg};
    }
    if(flag == 1){
        return {"data":itemInfo,
            "info":errorMsg};
    }
}

// to do加上读写锁
let preparePianoForDel = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    let num = getDateNum(itemDate);
    if(num == -1){
        return {"success":true};
    }
    itemBegin = timeLength*num+itemBegin;
    let itemEnd = itemBegin+itemDuration;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: itemRoomId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
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
    console.log(flag);
    if(flag == 0){
        return {"success":false,
                "info":errorMsg};
    }
    if(flag == 1){
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
            if(pianoInfo.piano_list.data[i] == '0' || pianoInfo.piano_list.data[i] == 48){
                newList += '0';
            }
            else{
                newList += '1';
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
        if(check == 0){
            errorMsg = "更新失败";
            return {"success":false,
                    "info":errorMsg};
        }
        else{
            return {"success":true};
        }
    }
}

let DeleteItem = async function(itemUuid){
    // 更改piano数据
    let item = await GetItemByUuid(itemUuid);
    let errorMsg = "";
    let result = await preparePianoForDel(item.data.item_roomId, item.data.item_begin, item.data.item_duration, item.data.item_date);
    if(result.success == false){
        errorMsg = "退订失败";
        return {"success":false,
                "info":errorMsg};
    }
    // 更新item数据
    let test = function(){
        return new Promise(resolve =>{
            db.where({item_uuid: itemUuid }).update('item', {item_type: 0}, function (err) {
                if(err == null){
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
    console.log(flag);
    if(flag == 0){
        return {"success":false,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"success":true,
                "info":errorMsg};
    }
}

let GetNoticeAll = async function(){
    let errorMsg = "";
    let noticeInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({notice_type: 1}).get('notice', function(err, rows, fields) {
                let _data = JSON.stringify(rows);
                noticeInfo = JSON.parse(_data);
                resolve(1);
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":noticeInfo,
                "info":errorMsg};
    }
    if(flag == 1){
        return {"data":noticeInfo,
                "info":errorMsg};
    }
}

let SearchNotice = async function(count, offset, title, author, order){
    let errorMsg = "";
    let noticeInfo = null;
    let noticeCount = 0;
    let query = { notice_title: title, notice_auth: author};
    for(let q in query)
    {
        if(!query[q])
        {
            delete query[q];
        }
    }
    let sortOrder = null;
    if(order === '-')
    {
        sortOrder = ['`notice_time` asc'];
    }
    else
    {
        sortOrder = ['`notice_time` desc'];
    }
    let test = function(){
        return new Promise(resolve =>{
            db.where(query)
                .where({notice_type: 1})
                .limit(count, offset)
                .order_by(sortOrder)
                .get('notice', function(err, rows, fields) {
                let _data = JSON.stringify(rows);
                noticeInfo = JSON.parse(_data);
                resolve(1);
            });
        });
    };
    let getNoticeCount = function(){
        return new Promise(resolve =>{
            db.where(query)
                .where({notice_type: 1})
                .count('notice', function (err, res, fields) {
                    noticeCount = res;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let flagCount = await getNoticeCount();
    console.log(flag);
    return {"data":noticeInfo,
        "count": noticeCount,
        "info":errorMsg};
};

let GetNoticeInfo = async function(noticeId){
    let errorMsg = "";
    let noticeInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ notice_id: noticeId }).get('notice', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
                    errorMsg = "公告不存在";
                    resolve(0);
                }
                else{
                    let _data = JSON.stringify(_select);
                    let _info = JSON.parse(_data);
                    noticeInfo = _info[0]
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"data":noticeInfo,
                "info":errorMsg};
    }
    if(flag == 1){
        console.log(noticeInfo);
        return {"data":noticeInfo,
                "info":errorMsg};
    }
}

let InsertNotice = async function(noticeTitle, noticeCont, noticeTime, noticeAuth, noticeType) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            let _info = {
                notice_title: noticeTitle,
                notice_cont: noticeCont,
                notice_time: noticeTime,
                notice_auth: noticeAuth,
                notice_type: noticeType
            }
            db.insert('notice', _info, function (err, info) {
                if(err == null){
                    resolve(1);
                }
                else{
                    errorMsg = "新建公告失败";
                    resolve(0);
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
}

let DeleteNotice = async function(noticeId) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({notice_id: noticeId }).update('notice', {notice_type: 0}, function (err) {
                if(err == null){
                    resolve(1);
                }
                else{
                    errorMsg = "删除失败";
                    resolve(0);
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
}

// 订单
exports.InsertItem = InsertItem;            // 新增订单
exports.ItemCheckin = ItemCheckin;            // 更新订单
exports.GetItem = GetItem;                  // 获取某个人的订单信息
exports.SearchItem = SearchItem;            // 查询订单(管理端)
exports.GetItemByUuid = GetItemByUuid;      // 获取订单信息，由uuid
exports.DeleteItem = DeleteItem;            // 删除订单-需要改写琴房信息
exports.InsertTempItem = InsertTempItem;
exports.DeleteTempItem = DeleteTempItem;
exports.GetTempItemByUuid = GetTempItemByUuid;

// 琴房
exports.GetPianoRoomInfo = GetPianoRoomInfo;// 获取单个琴房信息
exports.GetPianoRoomAll = GetPianoRoomAll;  // 获取所有琴房信息
exports.SearchPiano = SearchPiano;
exports.InsertPiano = InsertPiano;          // 新增琴房
exports.UpdatePianoInfo = UpdatePianoInfo;
exports.preparePianoForInsert = preparePianoForInsert;
exports.preparePianoForDel = preparePianoForDel;
exports.ChangePianoRule = ChangePianoRule;
// 每日更新琴房信息

// 注册
exports.SetRegisterMsg = SetRegisterMsg;    // 点击发送
exports.SocietyRegister = SocietyRegister;  // 点击注册
//exports.CampusRegister = SocietyRegister;

// 登录
exports.SetLoginMsg = SetLoginMsg;          // 点击发送
exports.SocietyLogin = SocietyLogin;        // 点击登录

// 用户
exports.GetSocietyUserInfo = GetSocietyUserInfo;  // 获取某个校外用户的信息
exports.GetSocietyUuidByTele = GetSocietyUuidByTele; // 通过手机号获取uuid
exports.ChangeSocietyType = ChangeSocietyType;      // 更新用户数据
exports.SearchSocietyUser = SearchSocietyUser;

// 公告
exports.GetNoticeAll = GetNoticeAll;            // 获取所有公告
exports.GetNoticeInfo = GetNoticeInfo;          // 获取一个公告，由notice_id
exports.InsertNotice = InsertNotice;            // 插入公告
exports.DeleteNotice = DeleteNotice;            // 删除公告
exports.SearchNotice = SearchNotice;

// 查询


