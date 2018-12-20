const Koa = require("koa");
const app = module.exports = new Koa();
const xmlParser = require('koa-xml-body');
const bodyParser = require("koa-bodyparser");
const views = require("./views/views");
const views_manage = require("./views/views_manage");
const session = require("koa-session");
const cors = require("koa2-cors");
let file = require("fs");
let dbconfigFile = "mysqlConfig.json";
let dbconfig = JSON.parse(file.readFileSync(dbconfigFile));
const configPath = "configs.json";
const configs = JSON.parse(file.readFileSync(configPath));
const stat = require('koa-static');


app.keys = configs.app_key;
app.use(session({
    maxAge: configs.expire_day *24*60*60*1000,
},app));

app.use(cors());
app.use(xmlParser({
    limit: 2048,
    xmlOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}))
app.use(bodyParser());

app.use(views.routes()).use(views.allowedMethods());

app.use(views_manage.routes()).use(views_manage.allowedMethods());
app.use(stat(__dirname));
if(!module.parent)
{
    app.listen(3000);
    console.log("listen on 3000");
}

