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

let SocietyRegister = async function(socType, socId, socRealname, socTele) {
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
    let test = function(){
        return new Promise(resolve =>{
            client.get(socTele, function(err, reply){
                if(reply){
                    if(socPassword == (reply.toString())){
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
                "info":errorMsg};
    }
    if(flag == 1){
        return {"success":true};
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

let GetPianoRoomInfo = async function(pianoId) {
    let errorMsg = "";
    let pianoInfo = null;
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
                    resolve(1);
                }
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

let InsertItem = async function(itemTime, itemUsername, itemRoom, itemType, itemMember, itemValue, itemDuration){
    // 琴房信息解析，查看是否可以预定。
    // 修改可预约时间段。
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            try{
                let _info = {
                    item_time: itemTime,
                    item_username: itemUsername,
                    item_room: itemRoom,
                    item_type: itemType,
                    item_member: itemMember,
                    item_value: itemValue,
                    item_duration: itemDuration,
                }
                db.insert('item', _info, function (err, info) {
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
        return {"data":itemInfo};
    }
}

exports.GetItem = GetItem;
exports.UpdateItem = UpdateItem;
exports.InsertItem = InsertItem;

exports.GetPianoRoomInfo = GetPianoRoomInfo;
exports.GetPianoRoomAll = GetPianoRoomAll;
exports.InsertPiano = InsertPiano;

exports.SocietyRegister = SocietyRegister;
exports.SocietyLogin = SocietyLogin;
exports.SetLoginMsg = SetLoginMsg;
exports.SetRegisterMsg = SetRegisterMsg;