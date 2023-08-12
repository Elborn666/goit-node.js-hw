const express = require('express');
const router = express.Router();

const controllers = require('../../controllers/contacts');
const {validateBody} = require('../../middlewares');
const {isVakidId} = require('../../middlewares');
const schema = require('../../schemas/contactSchema');

router.get('/', controllers.getAll);

router.get('/:id', isVakidId, controllers.getById);

router.post('/', validateBody(schema.addSchema), controllers.addContact);

router.delete('/:id', isVakidId, controllers.removeContact);

router.put('/:id', isVakidId,  validateBody(schema.addSchema), controllers.updateContact);

router.patch('/:id/favorite', isVakidId,  validateBody(schema.addSchemaFavorite), controllers.updateFavorite);

module.exports = router
