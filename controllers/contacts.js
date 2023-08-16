const { HttpError } = require('../helpers')
const { Contact } = require('../models')

const getAll = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    try {
        const result = await Contact.find({ owner }, { skip, limit }).populate("owner", "name email");
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const addContact = async (req, res, next) => {
    const { _id: owner } = req.user;
    try {
        const result = await Contact.create({ ...req.body, owner });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

const removeContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = Contact.findByIdAndRemove(id);
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json({
            message: "contact deleted"
        })
    } catch (error) {
        next(error)
    }
}

const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error);
    }
}

const updateFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAll,
    getById,
    addContact,
    removeContact,
    updateContact,
    updateFavorite,
}