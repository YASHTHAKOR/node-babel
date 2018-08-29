import express from 'express';

import userCtrl from './users';

let router = express.Router();

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

module.exports = router;