const router = require ('express').Router ();
const authController = require ('./auth.controller');

router.route ('/user/auth/register/').post (authController.register);
router.route ('/user/auth/login/').post (authController.login);
router.route('/user/auth/forgotPassword/').post (authController.forgotPassword)

module.exports = router;
