const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")
const SMSClient = require('@alicloud/sms-sdk')
const fs = reauire("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath))
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = configs.accessKeyId;
const secretAccessKey = configs.secretAccessKey;
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request)
    let tele = ctx.request.body.phoneNumber;
    let code = Math.floor(Math.random()*8999)+1000;
    let state = parseInt(ctx.request.body.state);
    let result = null;
    if(state === 0)
        result = await dataBase.SetRegisterMsg(tele,code);
    else
        result = await dataBase.SetLoginMsg(tele,code);
    if(!result.success)
    {
        ctx.response.body = result;
        return;
    }
    let sendsms = await smsClient.sendSMS({
        PhoneNumbers: tele,
    SignName: configs.SignName,
    TemplateCode: configs.TemplateCode,
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