const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request)
    let tele = ctx.request.body.teleNumber;
    //todo:查找是否存在
    let code = Math.floor(Math.random()*8999)+1000;
    //todo:存入数据库
    let sendsms = await smsClient.sendSMS({
        PhoneNumbers: tele,
    SignName: '云通信产品',
    TemplateCode: 'SMS_1000000',
    TemplateParam: JSON.stringify({"code": code.toString()}),
    }).then(function (res) {
            let {Code}=res
            if (Code === 'OK') {
                console.log(res);
                return {"success": true};
            }
        }, function (err) {
            console.log(err);
            return {"success": false};
        })
    ctx.response.body = sendsms;
    console.log(`signin with name: ${username}`);
})
module.exports = routers;