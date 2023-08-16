const express = require('express');
const router = express.Router();

const controllers = require('../../controllers/contacts');
const { validateBody } = require('../../middlewares');
const { isVakidId } = require('../../middlewares');
const { authenticate } = require('../../middlewares')
const {contactschemas} = require('../../models');

router.get('/', authenticate, controllers.getAll);

router.get('/:id', authenticate, isVakidId, controllers.getById);

router.post('/', authenticate, validateBody(contactschemas.addSchema), controllers.addContact);

router.delete('/:id', authenticate, isVakidId, controllers.removeContact);

router.put('/:id', authenticate, isVakidId, validateBody(contactschemas.addSchema), controllers.updateContact);

router.patch('/:id/favorite', authenticate, isVakidId, validateBody(contactschemas.addSchemaFavorite), controllers.updateFavorite);

module.exports = router
