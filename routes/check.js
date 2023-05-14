const expres = require('express');
const router = expres.Router();
const { createCheck, createReport,deleteCheck ,getCheck} = require('../controllers/checkController');
const { authenticate } = require('../middleware/auth')

router.post('/', authenticate, createCheck);
router.get('/', authenticate, getCheck);
router.get('/')
router.get('/report/:url', authenticate, createReport)
router.delete('/delete/:id',deleteCheck)

module.exports = router;
