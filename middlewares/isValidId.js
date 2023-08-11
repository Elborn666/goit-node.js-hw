const {isValidObjectId} = require('mongoose');
const {HttpError} = require('../helpers');

const isVakidId = (req, res, next) => {
    const{id} = req.body;
    if(!isValidObjectId(id)){
        next(HttpError(400, `${id} is not valid id`))
    }
    next();
}

module.exports = isVakidId;