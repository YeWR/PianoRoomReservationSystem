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


async function register(type, username, password, realname, idnumber, wechat, tele, item) {
    let test = function(){
        return new Promise(resolve =>{
            db.where({ user_name: username }).get('user', function (err, res, fields) {
                let _select = res;
                if (_select.length != 0) {
                    resolve(0);
                }
                else {
                    let _info = {
                        user_type: type,
                        user_wechat: wechat,
                        user_tele: tele,
                        user_id: idnumber,
                        user_item: item,
                        user_name: username,
                        user_realName: realname,
                        user_pass: password
                    };
                    db.insert('user', _info, function (err, info) { });
                    resolve(1);
                }
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"success":false};
    }
    if(flag == 1){
        return {"success":true};
    }
}

async function login(type, username, password) {
    let test = function(){
        return new Promise(resolve =>{
            db.where({ user_name: username }).get('user', function (err, res, fields) {
                let _select = res;
                let _data = JSON.stringify(_select);
                let _info = JSON.parse(_data);
                for (let i = 0; i < _info.length; i++) {
                    if (password == _info[i].user_pass) {
                        resolve(1);
                    }
                }
                resolve(0)
            });
        });
    };
    let flag = await test();
    console.log(flag);
    if(flag == 0){
        return {"success":false};
    }
    if(flag == 1){
        return {"success":true};
    }
}
