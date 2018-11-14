const Router = require("koa-router");
const router = new Router();

const register_out_school = require("./user/register_out_school");
const login = require("./user/login");
const reserve = require("./reserve/reserve");
const send_verification_code = require("./user/send_verification_code");
const alarm = require("./reserve/alarm");

router.use("/register", register_out_school.routes(), register_out_school.allowedMethods());
router.use("/alarm", alarm.routes(), alarm.allowedMethods());
router.use("/login", login.routes(), login.allowedMethods());
router.use("/reserve", reserve.routes(), reserve.allowedMethods());
router.use("/validate", send_verification_code.routes(), send_verification_code.allowedMethods());
module.exports = router;