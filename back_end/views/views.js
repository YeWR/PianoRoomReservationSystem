const Router = require("koa-router");
const router = new Router();

const register_out_school = require("./user/register_out_school");
//const login_in_school = require("./user/login_in_school");
const login_out_school = require("./user/login_out_school");
const reserve = require("./reserve/reserve");


router.use("/register", register_out_school.routes(), register_out_school.allowedMethods());
//router.use("/user/login_in_school", login_in_school.routes(), login_in_school.allowedMethods());
router.use("/login/outSchool", login_out_school.routes(), login_out_school.allowedMethods());
router.use("/reserve", reserve.routes(), reserve.allowedMethods());
module.exports = router;