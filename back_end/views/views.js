const Router = require('koa-router');
const router = new Router();

const register_out_school = require('./register/register_out_school');
const login_in_school = require('./login/login_in_school');
const login_out_school = require('./login/login_out_school');

router.use('/register_out_school', register_out_school.routes(), register_out_school.allowedMethods());
router.use('/login/login_in_school', login_in_school.routes(), login_in_school.allowedMethods());
router.use('/login/login_out_school', login_out_school.routes(), login_out_school.allowedMethods());

module.exports = router;