import Joi from "joi";


export const productSchema = Joi.object({
    name : Joi.string().min(3).max(100).required(),
    quantity : Joi.number().required(),

})