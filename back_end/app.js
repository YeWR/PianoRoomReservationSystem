const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const views = require("./views/views")
app.use(bodyParser());
app.use(views.routes()).use(views.allowedMethods());

app.listen(3000);
console.log("listen on 3000");
