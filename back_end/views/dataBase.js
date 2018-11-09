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

let SocietyRegister = async function(socType, socId, socRealname, socName, socPassword, socTele) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_name: socName }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length != 0) {
                    errorMsg = "用户名已经被使用"; // to do 
                    resolve(0);
                }
                else {
                    let _info = {
                        soc_type: socType,
                        soc_id: socId,
                        soc_realname: socRealname,
                        soc_name: socName,
                        soc_password: socPassword,
                        soc_tele: socTele
                    };
                    db.insert('society_user', _info, function (err, info) { });
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
        return {"success":true};
    }
}

let SocietyLogin = async function(socName, socPassword) {
    let errorMsg = "";
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_name: socName }).get('society_user', function (err, res, fields) {
                let _select = res;
                if(_select.length == 0){
                    errorMsg = "用户不存在";
                    resolve(0);
                }
                let _data = JSON.stringify(_select);
                let _info = JSON.parse(_data);
                for (let i = 0; i < _info.length; i++) {
                    if (socPassword == _info[i].soc_password) {
                        resolve(1);
                    }
                }
                errorMsg = "密码错误";
                resolve(0);
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
                    db.insert('piano', _info, function (err, info) { });
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
        return {"success":true};
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

let insertItem = async function(itemTime, itemUsername, itemRoom, itemType, itemMember, itemValue, itemDuration){
    // to do username exist
    // let errorMsg = "";
    // let test = function(){
    //     return new Promise(resolve =>{
    //             let _info = {
    //                 item_time: itemTime,
    //                 item_username: itemUsername,
    //                 item_room: itemRoom,
    //                 item_type: itemType,
    //                 item_member: itemMember,
    //                 item_value: itemValue,
    //                 item_duration: itemDuration,
    //             }
    //             db.insert('item', _info, function (err, info) { });
    //             resolve(1);
    //     });
    // };
    // let flag = await test();
    // console.log(flag);
    // if(flag == 0){
    //     return {"success":false,
    //             "info":errorMsg};
    // }
    // if(flag == 1){
    //     return {"success":true};
    // }
}

let updateItem = async function(itemTime, itemUsername, itemRoom, itemType, itemMember, itemValue, itemDuration){
    // to do 
    // check lock
}

exports.insertItem = insertItem;
exports.GetPianoRoomInfo = GetPianoRoomInfo;
exports.InsertPiano = InsertPiano;
exports.SocietyRegister = SocietyRegister;
exports.SocietyLogin = SocietyLogin;