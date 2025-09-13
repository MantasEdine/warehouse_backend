import Joi from "joi";



export const registerSchema = Joi.object({
    name : Joi.string().min(3).max(50).required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(8).required(),
    role : Joi.string().valid("admin","driver").default("driver"),
    phoneNumber : Joi.string()
    .pattern(/^\d+$/) // only digits
    .min(9)
    .max(15)
    .optional(),
    
})

export const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})