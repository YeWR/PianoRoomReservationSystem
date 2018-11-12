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
    let tele = ctx.request.body.phoneNumber;
    let code = Math.floor(Math.random()*8999)+1000;
    let result = await dataBase.SetRegisterMsg(tele,code);
    //let result = await dataBase.SetLoginMsg(tele,code);
    if(!result.success)
    {
        ctx.response.body = result;
        return;
    }
    let sendsms = await smsClient.sendSMS({
        PhoneNumbers: tele,
    SignName: '云通信产品',
    TemplateCode: 'SMS_1000000',
    TemplateParam: JSON.stringify({"code": code.toString()}),
    }).then(function (res) {
            let {Code}=res
            if (Code === 'OK') {
                console.log(Code);
                return {"success": true};
            }
        }, function (err) {
            let {Code}=res
            console.log(Code);
            return {"success": false, "info": Code};
        })
    ctx.response.body = sendsms;
})

module.exports = routers;