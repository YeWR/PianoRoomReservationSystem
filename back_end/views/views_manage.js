const Router = require("koa-router");
const router = new Router();

const manage_login = require("./manage/login");

router.use("/manager/login", manage_login.routes(), manage_login.allowedMethods());

module.exports = router;