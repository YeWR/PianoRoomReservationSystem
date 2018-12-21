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

let preparePianoForDel = async function(itemRoomId, itemBegin, itemDuration, itemDate){
    let errorMsg = "";
    let num = getDateNum(itemDate);
    if(num === -1){
        return {"success":true};
    }
    itemBegin = timeLength*num+itemBegin;
    let itemEnd = itemBegin+itemDuration;
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
                    newList += '0';
                    continue;
                }
            }
            if(pianoInfo.piano_list.data[i] === '0' || pianoInfo.piano_list.data[i] === 48){
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

let DeleteItem = async function(itemUuid){
    // 更改piano数据
    let item = await GetItemByUuid(itemUuid);
    let errorMsg = "";
    let result = await preparePianoForDel(item.data.item_roomId, item.data.item_begin, item.data.item_duration, item.data.item_date);
    if(result.success === false){
        errorMsg = "退订失败";
        return {"success":false,
            "info":errorMsg};
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
    console.log(flag);
    if(flag === 0){
        return {"success":false,
            "info":errorMsg};
    }
    if(flag === 1){
        return {"success":true,
            "info":errorMsg};
    }
}

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
    for(let i in itemInfo)
    {
        let orderTime = new Date(i.item_time).getTime();
        if(current - orderTime > 30*60*1000)
            await DeleteItem(i.item_uuid);
    }
};

SearchUnpaidItemAndDelete().then(val => {
    console.log("Autodelete Finish");
    process.exit();
})

