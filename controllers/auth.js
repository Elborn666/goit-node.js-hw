const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path')
const fs = require('fs/promises');

const { HttpError, sendEmail } = require('../helpers');
const { SECRET_KEY, BASE_URL } = require('../config');

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { User } = require('../models/user');
const { nanoid } = require("nanoid");

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email already in use")
    

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, rassword: hashPassword, avatarURL, verificationToken});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    };
    await  sendEmail(verifyEmail);


    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.json ({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(404, "User not found")
    }
    if(user.veryfy) {
        throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    };
    await  sendEmail(verifyEmail);

    res.json({
        message: "Verify email send success"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    if (!user.verify ) {
        throw HttpError(404, "User not found");
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

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, orirginalname} = req.file;
    const filename = `${_id}_${orirginalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarUrl});

    res.json({
        avatarURL,
    })
}

module.exports = {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
}