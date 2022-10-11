const mongoose = require("mongoose");
const Joi = require("joi");

let saleSchema = new mongoose.Schema({
  name:String,
  info:String,
  price:Number,
  img_url:String,
  year:Number,
  car_gear:String,
  cc:Number,
  cat_short_id:String,
  date_created:{
    type:Date,default:Date.now()
  },
  short_id:String,
  qty:{
    type:Number, default:1
  }
})

exports.saleModel = mongoose.model("sales",saleSchema);


exports.validateSale = (_bodyReq) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    info:Joi.string().min(3).max(500).required(),
    car_gear:Joi.string().min(3).max(10).required(),
    price:Joi.number().min(1).max(999999).required(),
    cat_short_id:Joi.string().min(2).max(99).required(),
    year:Joi.number().min(1).max(2050).required(),
    cc:Joi.number().min(600).max(9000).required(),
    img_url:Joi.string().min(3).max(500).allow(null,""),
    qty:Joi.number().min(1).max(9999).allow(null,"")
  })
  return joiSchema.validate(_bodyReq);
}