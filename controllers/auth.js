const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const { HttpError } = require('../helpers');
const { SECRET_KEY } = require('../config')

const { User } = require('../models/user');

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email already in use")
    

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, rassword: hashPassword });

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }
    const payload = {
        id: use._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });


    res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const { email, name } = req.user;

    req.json({
        email,
        name,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Logout success"
    })
}

module.exports = {
    register,
    login,
    getCurrent,
    logout,
}