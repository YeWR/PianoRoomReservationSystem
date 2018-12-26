const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const uuid = require("node-uuid");
const configPath = "configs.json";
let fs = require("fs");
const configs = JSON.parse(fs.readFileSync(configPath));
const request = require('request');
const parseString = require('xml2js').parseString;
const cryptoMO = require('crypto');
const utils = require("../utils");


async function validatePrice(pianoId, orderType, startIndex, endIndex, priceFromFront)
{
    let result = await dataBase.SearchPiano(1,0,null,null,pianoId);
    let pricePerHour = 0;
    if(result.data)
    {
        switch (orderType)
        {
            case 0:
                pricePerHour = result.data[0].piano_stuvalue;
                break;
            case 1:
                pricePerHour = result.data[0].piano_teavalue;
                break;
            case 2:
                pricePerHour = result.data[0].piano_socvalue;
                break;
            case 3:
                pricePerHour = result.data[0].piano_multivalue;
                break;
        }
        if(priceFromFront === pricePerHour * Math.ceil((endIndex - startIndex) / 6))
            return 1;
        else
            return 0;
    }
    else
        return 0;
}

function getNonceStr(len)
{
    let str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(let i = 0; i < len; i++)
    {
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

function itemTimeout(itemuuid)
{
    let result = dataBase.GetItemByUuid(itemuuid);
    if(result.data)
    {
        if(result.data.item_type === 3)
        {
            dataBase.DeleteItem(itemuuid);
        }
    }
}

//source: https://blog.csdn.net/zhuming3834/article/details/73168056
async function wechatPayment(ip, openid, price, uuid) {
    return new Promise((resolve, reject) => {
        let body = 'THU琴房预约测试支付'; // 商品描述
        let notify_url = 'https://958107.iterator-traits.com/user/reservation/validate/' + uuid; // 支付成功的回调地址  可访问 不带参数
        let nonce_str = getNonceStr(32); // 随机字符串
        let out_trade_no = uuid; // 商户订单号
        let total_fee = '1'; // 订单价格 单位是 分
        let timestamp = Math.round(new Date().getTime() / 1000); // 当前时间
        let bodyData = '<xml>';
        bodyData += '<appid>' + configs.pay_appid + '</appid>';  // 小程序ID
        bodyData += '<body>' + body + '</body>'; // 商品描述
        bodyData += '<mch_id>' + configs.pay_mchid + '</mch_id>'; // 商户号
        bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
        bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址
        bodyData += '<openid>' + openid + '</openid>'; // 用户标识
        bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
        bodyData += '<spbill_create_ip>' + ip + '</spbill_create_ip>'; // 终端IP
        bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
        bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI
        // 签名
        let sign = paysignjsapi(
            configs.pay_appid,
            body,
            configs.pay_mchid,
            nonce_str,
            notify_url,
            openid,
            out_trade_no,
            ip,
            total_fee
        );
        bodyData += '<sign>' + sign + '</sign>';
        bodyData += '</xml>';
        //console.log(bodyData);
        let returnValue = {};
        // 微信小程序统一下单接口
        let urlStr = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        request.post({
            url: urlStr,
            method: 'POST',
            body: bodyData
        }, function (error, response, body) {
            if (!error) {
                parseString(body, function (err, result) {
                    if (result.xml.return_code[0] === 'SUCCESS') {
                        returnValue.success = true;
                        // 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
                        returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
                        returnValue.timeStamp = timestamp.toString(); // 时间戳
                        returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
                        returnValue.paySign = paysignjs(configs.pay_appid, returnValue.nonceStr, returnValue.package, 'MD5', timestamp); // 签名
                    } else {
                        returnValue.msg = result.xml.return_msg[0];
                        returnValue.success = false;
                    }
                    resolve(returnValue);
                });
            }
            else {
                returnValue.msg = "error";
                returnValue.success = false;
                resolve(returnValue);
            }
        });
    })
}
function paysignjsapi(appid,body,mch_id,nonce_str,notify_url,openid,out_trade_no,spbill_create_ip,total_fee) {
    let ret = {
        appid: appid,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url:notify_url,
        openid:openid,
        out_trade_no:out_trade_no,
        spbill_create_ip:spbill_create_ip,
        total_fee:total_fee,
        trade_type: 'JSAPI'
    };
    let str = raw(ret);
    str = str + '&key='+configs.pay_mchkey;
    let md5Str = cryptoMO.createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
}
function raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    let newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let str = '';
    for(let k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);
    return str;
}
function paysignjs(appid, nonceStr, pkg, signType, timeStamp) {
    let ret = {
        appId: appid,
        nonceStr: nonceStr,
        package: pkg,
        signType: signType,
        timeStamp: timeStamp
    };
    let str = raw1(ret);
    str = str + '&key='+configs.pay_mchkey;
    return cryptoMO.createHash('md5').update(str).digest('hex');
}

function raw1(args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function(key) {
        newArgs[key] = args[key];
    });

    let str = '';
    for(let k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);
    return str;
}

const getUserIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

const routers = router.post("/cancel", async (ctx, next) => {
    let uuid = ctx.request.body.reservationId;
    console.log(uuid);
    let result = await dataBase.DeleteItem(uuid);
    ctx.response.body = result;
}).get("/all", async (ctx, next) => {
    let number = ctx.query.number;
    let userId = await dataBase.GetUserUuidByNumber(number);
    userId = userId.data;
    let result = await dataBase.SearchItem(2147483647,0,userId,null,null,[1,2],"-",30);
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "reservationList": null,
            "info": result.info
        };
    }
    else
    {
        let reservationList = [];
        const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let pianoInfo = await dataBase.GetPianoRoomAll();
        let nowDate = new Date();
        nowDate.setHours(0,0,0);
        for(let p of result.data)
        {
            for(let i of pianoInfo.data)
            {
                if (i.piano_id === p.item_roomId)
                {
                    let date = new Date(p.item_date);
                    let dateStr = utils.getDateStr(date);
                    let week = date.getDay();
                    let info = {
                        "pianoPlace": i.piano_room,
                        "pianoType": i.piano_type,
                        "pianoPrice": p.item_value,
                        "reservationType": p.item_member,
                        "reservationState": p.item_type,
                        "reservationId": p.item_uuid,
                        "date": dateStr,
                        "weekday": weekStr[week],
                        "begTimeIndex": p.item_begin,
                        "endTimeIndex": p.item_begin + p.item_duration
                    };
                    reservationList.push(info);
                    break;
                }
            }
        }
        //reservationList = reservationList.sort(sortItemAll);
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
}).get("/notpaid", async (ctx, next) => {
    let number = ctx.query.number;
    let userId = await dataBase.GetUserUuidByNumber(number);
    userId = userId.data;
    let result = await dataBase.SearchItem(2147483647,0,userId,null,null,[-1,3],"-",null);
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "reservationList": null,
            "info": result.info
        };
    }
    else
    {
        let reservationList = [];
        const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let pianoInfo = await dataBase.GetPianoRoomAll();
        let nowDate = new Date();
        nowDate.setHours(0,0,0);
        for(let p of result.data)
        {
            for(let i of pianoInfo.data)
            {
                if (i.piano_id === p.item_roomId)
                {
                    let date = new Date(p.item_date);
                    let dateStr = utils.getDateStr(date);
                    let week = date.getDay();
                    let ordertime = Date.parse(p.item_time);
                    if(p.item_type === 3)
                    {
                        ordertime += 30*60*1000;
                    }
                    else
                    {
                        ordertime = new Date(p.item_date);
                        ordertime.setHours(8+Math.floor(p.item_begin/6));
                        ordertime.setMinutes(10*(p.item_begin%6));
                        ordertime.setSeconds(0,0);
                        ordertime -= 30*60*1000;
                        //ordertime = ordertime.getTime();
                    }
                    let info = {
                        "pianoPlace": i.piano_room,
                        "pianoType": i.piano_type,
                        "pianoPrice": p.item_value,
                        "reservationType": p.item_member,
                        "reservationState": p.item_type,
                        "reservationId": p.item_uuid,
                        "date": dateStr,
                        "weekday": weekStr[week],
                        "begTimeIndex": p.item_begin,
                        "endTimeIndex": p.item_begin + p.item_duration,
                        "deadlineTime": ordertime
                    };
                    if(info.deadlineTime > new Date().getTime())
                    {
                        reservationList.push(info);
                    }
                    else
                    {
                        let del = await dataBase.DeleteItem(info.reservationId);
                    }
                    break;
                }
            }
        }
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
}).get("/alarm", async (ctx, next) => {
    let number = ctx.query.number;
    let userId = await dataBase.GetUserUuidByNumber(number);
    userId = userId.data;
    let result = await dataBase.SearchItem(2147483647,0,userId,null,null,[1],"+",3);
    if(result.data === null)
    {
        ctx.response.body = {
            "success": false,
            "reservationList": null,
            "info": result.info
        };
    }
    else
    {
        let reservationList = [];
        const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let pianoInfo = await dataBase.GetPianoRoomAll();
        let nowDate = new Date();
        for(let p of result.data)
        {
            let date = new Date(p.item_date);
            if(utils.compTime(nowDate, date, p.item_begin+p.item_duration))
            {
                for(let i of pianoInfo.data)
                {
                    if (i.piano_id === p.item_roomId)
                    {
                        let dateStr = utils.getDateStr(date);
                        let week = date.getDay();
                        let info = {
                            "pianoPlace": i.piano_room,
                            "pianoType": i.piano_type,
                            "pianoPrice": p.item_value,
                            "reservationType": p.item_member,
                            "reservationState": p.item_type,
                            "reservationId": p.item_uuid,
                            "date": dateStr,
                            "weekday": weekStr[week],
                            "begTimeIndex": p.item_begin,
                            "endTimeIndex": p.item_begin + p.item_duration
                        };
                        reservationList.push(info);
                        break;
                    }
                }
            }
        }
        //reservationList = reservationList.sort(sortItemAlarm);
        ctx.response.body = {
            "success": true,
            "reservationList": reservationList
        };
    }
}).post("/order", async (ctx, next) => {
    console.log(ctx.request.body);
    let number = ctx.request.body.number;
    let userId = await dataBase.GetUserUuidByNumber(number);
    userId = userId.data;
    //查看是否有未支付订单
    let unpayed = await dataBase.SearchItem(1,0,userId,null,null,3,"+",null);
    if(unpayed.count > 0)
    {
        ctx.response.body = {
            "success": false,
            "info": "您有未支付订单，请前往个人中心->未支付订单支付!"
        };
        return;
    }
    let userInfo = await dataBase.GetUserInfo(userId);
    if(userInfo.data.status)
    {
        let clientIP = getUserIp(ctx.req).replace(/::ffff:/, '');
        let openId = ctx.request.body.openid;
        let pianoId = ctx.request.body.pianoId;
        let reserveType = parseInt(ctx.request.body.reservationType);
        let pianoPrice = parseInt(ctx.request.body.pianoPrice);
        let begTimeIndex = parseInt(ctx.request.body.begTimeIndex);
        let endTimeIndex = parseInt(ctx.request.body.endTimeIndex);
        let priceCheck = await validatePrice(pianoId, reserveType, begTimeIndex, endTimeIndex, pianoPrice);
        if(!priceCheck)
        {
            ctx.response.body = {
                "success": false,
                "info": "金额不匹配"
            }
            return;
        }
        let dateStr = ctx.request.body.date;
        dateStr = dateStr.concat(" 08:00:00");
        let duration = endTimeIndex - begTimeIndex;
        let itemUuid = uuid.v1().toString();
        itemUuid = itemUuid.replace(/\-/g,'');
        let result = await dataBase.InsertItem(dateStr, userId, pianoId, 3, reserveType, pianoPrice, duration, begTimeIndex, itemUuid);
        if(result.success)
        {
            //setTimeout(()=>{itemTimeout(itemUuid)},30*60*1000);
            ctx.response.body = {
                "success": true,
                "info": "下单成功",
                "reservationId": itemUuid
            }
        }
        else
        {
            ctx.response.body = {
                "success": false,
                "info": "预订失败!"
            }
        }
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "info": "您已被加入黑名单，无法预约，请联系管理员!"
        }
    }
}).post("/pay", async (ctx, next) => {
    console.log(ctx.request.body);
    let uuid = ctx.request.body.reservationId;
    let openId = ctx.request.body.openid;
    let clientIP = getUserIp(ctx.req).replace(/::ffff:/, '');
    let itemInfo = await dataBase.GetItemByUuid(uuid);
    console.log(itemInfo);
    if(itemInfo.data &&(itemInfo.data.item_type === 3 || itemInfo.data.item_type === -1))
    {
        let result = await wechatPayment(clientIP, openId, itemInfo.data.item_value, uuid);
        if(result.success)
        {
            ctx.response.body = {
                "success": true,
                "info": "下单成功",
                "sign": {
                    "timeStamp": result.timeStamp,
                    "nonceStr": result.nonceStr,
                    "package": result.package,
                    "paySign": result.paySign
                }
            }
        }
        else
        {
            ctx.response.body = {
                "success": false,
                "info": result.msg
            }
        }
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "info": "订单已过期!"
        }
    }
}).post("/validate/:uuid", async (ctx, next) => {
    let id = ctx.params.uuid;
    let result = ctx.request.body;
    if (result.xml.return_code === 'SUCCESS' && result.xml.result_code === 'SUCCESS')
    {
        let resultdb = await dataBase.ItemPaySuccess(id);
        if(resultdb.success)
        {
            ctx.response.status = 200;
            ctx.response.body = "<xml>" +
                "<return_code><![CDATA[SUCCESS]]></return_code>" +
                "<return_msg><![CDATA[OK]]></return_msg>" +
                "</xml>";
        }
        else
        {
            console.log("确认支付失败");
            ctx.response.status = 404;
        }
    }
    else
    {
        console.log("支付失败");
        ctx.response.status = 404;
    }
}).post('/ordertest', async (ctx, next) => {
    let number = ctx.request.body.number;
    let userId = await dataBase.GetUserUuidByNumber(number);
    userId = userId.data;
    let userInfo = await dataBase.GetUserInfo(userId);
    if(userInfo.data.status)
    {
        let pianoId = ctx.request.body.pianoId;
        let reserveType = parseInt(ctx.request.body.reservationType);
        let pianoPrice = parseInt(ctx.request.body.pianoPrice);
        let begTimeIndex = parseInt(ctx.request.body.begTimeIndex);
        let endTimeIndex = parseInt(ctx.request.body.endTimeIndex);
        let dateStr = ctx.request.body.date;
        dateStr.concat(" 08:00:00");
        let duration = endTimeIndex - begTimeIndex;
        let itemUuid = uuid.v1();
        let result = await dataBase.InsertItem(dateStr, userId, pianoId, 1, reserveType, pianoPrice, duration, begTimeIndex, itemUuid);
        ctx.response.body = result;
    }
    else
    {
        ctx.response.body = {
            "success": false,
            "info": "您已被加入黑名单，无法预约，请联系管理员!"
        }
    }
});

module.exports = routers;