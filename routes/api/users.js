const express = require('express');
const router = express.Router();

const { authschemas } = require('../../models')
const { validateBody, authenticate, upload} = require('../../middlewares');

const controller = require('../../controllers/auth')

router.post('/register', validateBody(authschemas.registerSchema), controller.register);

router.post('/login', validateBody(authschemas.loginSchema), controller.login)

router.get('/current', authenticate, controller.getCurrent);

router.post('/logout', authenticate, controller.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), controller.updateAvatar)

module.exports = router