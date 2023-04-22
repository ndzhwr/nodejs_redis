import Joi = require("joi");
import { title } from "process";

const bookSchema = Joi.object({
    title: Joi.string()
        .required()
        .max(50)
        .min(1),
    content: Joi.string()
        .required()
        .max(50)
        .min(1),
    userId: Joi.string()
        .required()
        .min(5)
})

export default bookSchema