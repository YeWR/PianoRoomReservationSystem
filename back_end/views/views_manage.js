const Router = require("koa-router");
const router = new Router();

const manage_login = require("./manage/login");
const manage_info = require("./manage/info");
const manage_logout = require("./manage/logout");

router.use("/manager/login", manage_login.routes(), manage_login.allowedMethods());
router.use("/manager/info", manage_info.routes(), manage_info.allowedMethods());
router.use("/manager/logout", manage_logout.routes(), manage_logout.allowedMethods());

module.exports = router;