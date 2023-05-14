const expres = require('express');
const router = expres.Router();
const { register, login, verify } = require('../controllers/userController')

router.post('/', register);

router.post('/login', login);

router.get("/verify/:id/:token", verify);
module.exports = router;
