const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const views = require("./views/views");
const session = require("koa-session2");
const sessionStore = require("koa-redis");

app.use(session({
    maxAge: 10*24*60*60*1000,  //10天
    store: new sessionStore({

    })
},app));

//app.use(async (ctx, next) => {
//    let reg = /^((\/register)|(\/login)|(\/validate))/
//    if(!ctx.cookies.get('koa:sess') && !reg.test(ctx.path)){
//        console.log(ctx.cookies.get('koa:sess'),ctx.path);
//        ctx.response.body = {"success": false, "info": "请登录"};
//return;
//    }
//    await next();
//})

app.use(bodyParser());

app.use(views.routes()).use(views.allowedMethods());

app.listen(3000);
console.log("listen on 3000");
