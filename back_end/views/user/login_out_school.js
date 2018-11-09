const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.post("/", async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;
    console.log(`login with name: ${username}, password: ${password}`);
    let result = dataBase.SocietyLogin(username,password);
    result.then(res=>{ctx.response.body = res}).catch(res=>{ctx.response.body = {success:false, info: "Database Error"}})
});

module.exports = routers;