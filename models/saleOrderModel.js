const mongoose = require("mongoose");
const Joi = require("joi");

const saleOrderSchema = new mongoose.Schema({
  date_created:{
    type:Date,default:Date.now()
  },
  user_id:String,
  price:Number,
  name:String,
  car_short_id:String,
  address:String,
  phone:String,
  email:String
})

exports.SaleOrderModel = mongoose.model("saleOrders",saleOrderSchema);

exports.validateSaleOrder = (_bodyReq) => {
  let joiScehma = Joi.object({
    price:Joi.number().min(1).max(999999).required(),
    car_short_id:Joi.string().min(2).max(99).required(),
  })
  return joiScehma.validate(_bodyReq);
}