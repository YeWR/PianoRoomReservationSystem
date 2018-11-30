const Router = require("koa-router");
const router = new Router();

const register = require("./user/register");
const login = require("./user/login");
const send_verification_code = require("./user/verification_code");
const cookie = require("./user/cookie");
const notice = require("./user/notice");
const piano = require("./user/piano");
const reservation = require("./user/reservation");


router.use("/user/registration", register.routes(), register.allowedMethods());
router.use("/user/code", send_verification_code.routes(), send_verification_code.allowedMethods());
router.use("/user/login", login.routes(), login.allowedMethods());
router.use("/user/cookie", cookie.routes(), cookie.allowedMethods());
router.use("/user/piano", piano.routes(), piano.allowedMethods());
router.use("/user/reservation", reservation.routes(), reservation.allowedMethods());
router.use("/user/notice", notice.routes(), notice.allowedMethods());

module.exports = router;