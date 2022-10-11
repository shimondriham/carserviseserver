const mongoose = require("mongoose");
const Joi = require("joi");

let rentalSchema = new mongoose.Schema({
  name:String,
  info:String,
  day_price:Number,
  img_url:String,
  year:Number,
  cat_short_id:String,
  date_created:{
    type:Date,default:Date.now()
  },
  user_id:String,
  short_id:String,
  in_use:Array
})

exports.rentalModel = mongoose.model("rentals",rentalSchema);

exports.validateRental = (_bodyReq) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    info:Joi.string().min(3).max(500).required(),
    day_price:Joi.number().min(1).max(999999).required(),
    cat_short_id:Joi.string().min(2).max(99).required(),
    year:Joi.number().min(1).max(2050).required(),
    img_url:Joi.string().min(3).max(500).allow(null,""),
    qty:Joi.number().min(1).max(9999).allow(null,""),
  })
  return joiSchema.validate(_bodyReq);
}