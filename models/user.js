const {Schema, model} = require('mongoose');
const { handleMongooseError } = require("../helpers");

const Joi = require('joi');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema ({
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        match: emailRegex,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: String,
      avatarURL: String,
      erify: {
        type: Boolean,
        default: false,
      },
      verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
      },
})

userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
})

const verifySchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
})

const authschemas = {
    registerSchema,
    verifySchema,
    loginSchema,
}

module.exports = {User, authschemas};