const Router = require("koa-router");
const router = new Router();

const register = require("./user/register_out_school");
const login = require("./user/login");
const reserve = require("./reserve/reserve");
const send_verification_code = require("./user/send_verification_code");
const alarm = require("./reserve/alarm");
const notice = require("./notice/notice");
const reservation = require("./reservation/reservation");

router.use("/register", register.routes(), register.allowedMethods());
router.use("/alarm", alarm.routes(), alarm.allowedMethods());
router.use("/login", login.routes(), login.allowedMethods());
router.use("/reserve", reserve.routes(), reserve.allowedMethods());
router.use("/validate", send_verification_code.routes(), send_verification_code.allowedMethods());
router.use("/reservation", reservation.routes(), reservation.allowedMethods());
router.use("/notice", notice.routes(), notice.allowedMethods());
module.exports = router;