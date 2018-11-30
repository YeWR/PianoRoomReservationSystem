const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const views = require("./views/views");
const views_manage = require("./views/views_manage");
const session = require("koa-session");
const sessionStore = require("koa-mysql-session");
let file = require("fs");
let dbconfigFile = "mysqlConfig.json";
let dbconfig = JSON.parse(file.readFileSync(dbconfigFile));
const configPath = "configs.json";
const configs = JSON.parse(file.readFileSync(configPath));

app.keys = configs.app_key;
app.use(session({
    maxAge: configs.expire_day *24*60*60*1000,
},app));


app.use(bodyParser());

app.use(views.routes()).use(views.allowedMethods());

app.use(views_manage.routes()).use(views_manage.allowedMethods());

app.listen(3000);
console.log("listen on 3000");
