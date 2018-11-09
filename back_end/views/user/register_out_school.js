const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    console.log(ctx.request)
    let username = ctx.request.body.username,
        password = ctx.request.body.password,
        realname = ctx.request.body.realname,
        idNumber = ctx.request.body.idNumber;
    let result = dataBase.SocietyRegister(1,idNumber,realname,username,password,null);
    result.then(res=>{ctx.response.body = res}).catch(res=>{ctx.response.body = {success:false, info: "Database Error"}})
    console.log(`signin with name: ${username}, password: ${password}`);
});

module.exports = routers;