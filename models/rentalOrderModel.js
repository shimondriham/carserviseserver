const mongoose = require("mongoose");
const Joi = require("joi");

const rentalOrderSchema = new mongoose.Schema({
  date_created:{
    type:Date,default:Date.now()
  },
  total_price:Number,
  user_id:String,
  car_short_id:String,
  name:String,
  address:String,
  phone:String,
  email:String,
  startDate:Date,
  endDate:Date
})

exports.RentalOrderModel = mongoose.model("rentalOrders",rentalOrderSchema);

exports.validateRentalOrder = (_bodyReq) => {
  let joiScehma = Joi.object({
    car_short_id:Joi.string().min(2).max(99).required(),
    total_price:Joi.number().min(1).max(999999).required(),
    startDate:Joi.string().min(1).max(100).required(),
    endDate:Joi.string().min(1).max(100).required()
  })
  return joiScehma.validate(_bodyReq);
}