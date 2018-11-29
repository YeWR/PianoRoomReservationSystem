const Router = require("koa-router");
const router = new Router();

const register = require("./user/register_out_school");
const login = require("./user/login");
const reserve = require("./user/reserve");
const send_verification_code = require("./user/send_verification_code");
const alarm = require("./user/alarm");
const notice = require("./user/notice");
const reservation = require("./user/reservation");
const manage_login = require("./manage/manage_login");

router.use("/register", register.routes(), register.allowedMethods());
router.use("/alarm", alarm.routes(), alarm.allowedMethods());
router.use("/login", login.routes(), login.allowedMethods());
router.use("/reserve", reserve.routes(), reserve.allowedMethods());
router.use("/validate", send_verification_code.routes(), send_verification_code.allowedMethods());
router.use("/reservation", reservation.routes(), reservation.allowedMethods());
router.use("/notice", notice.routes(), notice.allowedMethods());

router.use("/manage/login", manage_login.routes(), manage_login.allowedMethods());
module.exports = router;