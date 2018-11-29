const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase");
const SMSClient = require('@alicloud/sms-sdk');
const fs = require("fs");
const configPath = "configs.json";
const configs = JSON.parse(fs.readFileSync(configPath));

const accessKeyId = configs.accessKeyId;
const secretAccessKey = configs.secretAccessKey;
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey});

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request.body);
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
            let {Code}=res;
            if (Code === 'OK') {
                console.log(res);
                return {"success": true};
            }
        }, function (err) {
            console.log(err);
            return {"success": false, "info": err.data.Message};
        });
    console.log(sendsms);
    ctx.response.body = sendsms;
});

module.exports = routers;