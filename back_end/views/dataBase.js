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

let GetSocietyUserInfo = async function(userId){
    let errorMsg = "";
    let userInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_tele: userId }).get('society_user', function (err, res, fields) {
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

let SocietyRegister = async function(socType, socId, socRealname, socTele, socPassword) {
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
                        soc_tele: socTele
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

let InsertPiano = async function(pianoList, pianoId, pianoRoom, pianoPicurl, pianoInfo, pianoStuvalue, pianoTeavalue, pianoSocvalue, pianoMultivalue, pianoType) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({ piano_id: pianoId }).get('piano', function (err, res, fields) {
                let _select = res;
                if(_select.length != 0){
                    errorMsg = "琴房已经存在";
                    resolve(0);
                }
                else{
                    let _info = {
                        piano_list: pianoList,
                        piano_id: pianoId,
                        piano_room: pianoRoom,
                        piano_picurl: pianoPicurl,
                        piano_info: pianoInfo,
                        piano_stuvalue: pianoStuvalue,
                        piano_socvalue: pianoSocvalue,
                        piano_teavalue: pianoTeavalue,
                        piano_multivalue: pianoMultivalue,
                        piano_type: pianoType
                    }
                    db.insert('piano', _info, function (err, info) { 
                        if(err == null){
                            resolve(1);
                        }
                        else{
                            errorMsg = "新建琴房失败";
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
}
// s = InsertItem('2018-11-13 08:00:00','wu',203,1,3,10,1,0)
let getDateNum = function(itemDate){
    let item_date = new Date(itemDate);
    let now_date = new Date();
    now_date.setHours(now_date.getHours()+8);
    if(now_date>item_date){
        return 0;
    }
    else{
        item_date.setDate(item_date.getDate()-1);
        //console.log(item_date);
        //console.log(now_date);
        if(now_date>item_date){
            //console.log('=-------------------1');
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
                    
                    for(let i = num*84; i<(num+1)*84; i++){
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

// 加上读写锁
let preparePiano = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    itemBegin = 84*getDateNum(itemDate)+itemBegin;
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
        //console.log(newList);
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

// begin is the begin index, duration is the length
let InsertItem = async function(itemDate, itemUsername, itemRoomId, itemType, itemMember, itemValue, itemDuration, itemBegin){
    let errorMsg = "";
    // 修改可预约时间段。
    let result = await preparePiano(itemRoomId, itemBegin, itemDuration, itemDate);
    if(result.success == false){
        errorMsg = "预约失败";
        return {"success":false,
                "info":errorMsg};
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
                    item_begin: itemBegin
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

let UpdateItem = async function(itemTime, itemUsername, itemRoom, itemType, itemMember, itemValue, itemDuration){
    // to do 
    // check lock
}

let GetItem = async function(itemUsername){
    let errorMsg = "";
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where({ item_username: itemUsername }).get('item', function (err, res, fields) {
                let _data = JSON.stringify(res);
                itemInfo = JSON.parse(_data);
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
        //console.log(itemInfo[0].item_date);
        return {"data":itemInfo};
    }
}



// 订单
exports.InsertItem = InsertItem;            // 新增订单
exports.UpdateItem = UpdateItem;            // 更新订单
exports.GetItem = GetItem;                  // 获取某个人的订单信息

// 琴房
exports.GetPianoRoomInfo = GetPianoRoomInfo;// 获取单个琴房信息
exports.GetPianoRoomAll = GetPianoRoomAll;  // 获取所有琴房信息
exports.InsertPiano = InsertPiano;          // 新增琴房

// 注册
exports.SetRegisterMsg = SetRegisterMsg;    // 点击发送
exports.SocietyRegister = SocietyRegister;  // 点击注册

// 登录
exports.SetLoginMsg = SetLoginMsg;          // 点击发送
exports.SocietyLogin = SocietyLogin;        // 点击登录

//用户
exports.GetSocietyUserInfo = GetSocietyUserInfo;  // 获取某个校外用户的信息
