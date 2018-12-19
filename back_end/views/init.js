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

let timeLength = 84

// 只在开始的时候执行一次
let doInit = async function(id, buffer, use){
    let init = function(){
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
    let check = await init()
    if(check == 0){
        return 0;
    }
    else{
        return 1;
    }
}

let init = async function(){
    let now = new Date()
    let errorMsg = "";
    let pianoInfo;
    let test = function(){
        return new Promise(resolve =>{
            db.get('piano', function(err, rows, fields) { 
                let _data = JSON.stringify(rows);
                pianoInfo = JSON.parse(_data);
                console.log(pianoInfo)
                for(let i = 0; i<pianoInfo.length; i++){
                    let buffer =  ""
                    for(let j = (now.getDay()-1)*timeLength; j<(now.getDay()+6)*timeLength; j++){
                        if(pianoInfo[i].piano_rule.data[j%(7*timeLength)] == '0' || pianoInfo[i].piano_rule.data[j%(7*timeLength)] == 48){
                            buffer += '0'
                        }
                        else{
                            buffer += '1'
                        }
                    }
                    let use = ""
                    for(let j = 0; j<3*timeLength; j++){
                        if(buffer[j] == '0' || buffer[j] == 48){
                            use += '0'
                        }
                        else{
                            use += '1'
                        }
                    }
                    doInit(pianoInfo[i].piano_id,buffer,use)
                }
                resolve(1);
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

init()

