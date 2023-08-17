const validateBody = require('./validateBody');
const isVakidId = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./upload');

module.exports = {
    validateBody,
    isVakidId,
    authenticate,
    upload,
}