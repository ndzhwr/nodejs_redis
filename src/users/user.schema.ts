import Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .max(10)
        .min(3)
        .required(),
    email: Joi.string()
        .email()
        .required()
})


export default userSchema