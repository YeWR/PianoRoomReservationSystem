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


async function SocietyRegister(socType, socId, socRealname, socName, socPassword, socTele) {
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_name: socName }).get('society_user', function (err, res, fields) {
                let _select = res;
                if (_select.length != 0) {
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
        return {"success":false, "info": "hhh"};
    }
    if(flag == 1){
        return {"success":true};
    }
}

async function SocietyLogin(socName, socPassword) {
    let test = function(){
        return new Promise(resolve =>{
            db.where({ soc_name: socName }).get('society_user', function (err, res, fields) {
                let _select = res;
                let _data = JSON.stringify(_select);
                let _info = JSON.parse(_data);
                for (let i = 0; i < _info.length; i++) {
                    if (socPassword == _info[i].soc_password) {
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
        return {"success":false, "info": "hhh"};
    }
    if(flag == 1){
        return {"success":true};
    }
}

