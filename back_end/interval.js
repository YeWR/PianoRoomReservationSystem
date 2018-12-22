let file = require("fs");
let Db = require("mysql-activerecord");

let configFile = "mysqlConfig.json";
let config = JSON.parse(file.readFileSync(configFile));
let database = require("./views/dataBase");

let db = new Db.Adapter({
    server: config.serverIp,
    username: config.userName,
    password: config.passWord,
    database: config.dataBase,
    reconnectTimeout: config.TimeOut
});

let SearchUnpaidItemAndDelete = async function(){
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where('item_type', 3)
                .get('item', function (err, res, fields) {
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo = _info;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let current = new Date().getTime();
    for(let i of itemInfo)
    {
        let orderTime = new Date(i.item_time);
        orderTime = orderTime.getTime();
        console.log(current);
        console.log(orderTime);
        if(current - orderTime > 30*60*1000)
            await database.DeleteItem(i.item_uuid);
    }
};

let SearchUnpaidLongItemAndDelete = async function(){
    let itemInfo = null;
    let test = function(){
        return new Promise(resolve =>{
            db.where('item_type', -1)
                .get('item', function (err, res, fields) {
                    let _data = JSON.stringify(res);
                    let _info = JSON.parse(_data);
                    itemInfo = _info;
                    resolve(1);
                });
        });
    };
    let flag = await test();
    let current = new Date().getTime();
    for(let i of itemInfo)
    {
        let orderTime = new Date(i.item_date);
        orderTime.setHours(8+Math.floor(i.item_begin/6));
        orderTime.setMinutes(10*(i.item_begin%6));
        orderTime.setSeconds(0,0);
        if(orderTime.getTime() - current < 30*60*1000)
            await database.DeleteItem(i.item_uuid);
    }
};

let run = async function()
{
    await SearchUnpaidItemAndDelete();
    await SearchUnpaidLongItemAndDelete();
}

run().then(val => {
    console.log("Autodelete Finish");
    process.exit();
});

