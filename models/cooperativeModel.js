const mongoose = require("mongoose");
const Joi = require("joi");

let CooperativeSchema = new mongoose.Schema({
  name:String,
  info:String,
  day_price:Number,
  img_url:String,
  year:Number,
  date_created:{
    type:Date,default:Date.now()
  },
  user_id:String,
  longitude:Number,
  attitude:Number,
  short_id:String,
  in_use:Array,
  address:String
})

exports.CooperativeModel = mongoose.model("Cooperatives",CooperativeSchema);

exports.validateCooperative = (_bodyReq) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    info:Joi.string().min(3).max(500).required(),
    address:Joi.string().min(3).max(150).required(),
    day_price:Joi.number().min(1).max(999999).required(),
    longitude:Joi.number().required(),
    attitude:Joi.number().required(),
    year:Joi.number().min(1).max(2050).required(),
    img_url:Joi.string().min(3).max(500).allow(null,""),
  })
  return joiSchema.validate(_bodyReq);
}