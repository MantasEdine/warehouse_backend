import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  quantity: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(), // price in DZA
  currency: Joi.string().valid("DZA").default("DZA"),
});
