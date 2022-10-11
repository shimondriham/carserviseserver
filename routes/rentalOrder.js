const express = require("express");
const { auth, authAdmin, payPalAuth } = require("../middlewares/auth");
const { validateRentalOrder,RentalOrderModel } = require("../models/rentalOrderModel");
const { rentalModel } = require("../models/rentalModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();
router.get("/", (req,res) => {
  res.json({msg:"Rental Orders work"})
})

router.get("/allOrders", authAdmin, async(req,res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let user_id = req.query.user_id;
  try{
    let filter = user_id ? {user_id:user_id} : {}
    let data = await RentalOrderModel.find(filter)
    .limit(perPage)
    .skip(page * perPage)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

router.get("/amount" , auth , async(req,res) => {
  try{
    let amount = await RentalOrderModel.countDocuments({});
    res.json({amount})
  }
  catch(err){ 
    console.log(err);
    return res.status(500).json(err);
  }
})

router.get("/userOrder", auth , async(req,res) => {
  try{
    let data = await RentalOrderModel.find({user_id:req.tokenData._id})
    .limit(20)
    .sort({_id:-1})
    res.json(data);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

router.get("/productsInfo/:idOrder", auth,async(req,res) => {
  try{
    let order = await RentalOrderModel.findOne({_id:req.params.idOrder});
    let prodShortIds_ar = order.products_ar.map(item => item.s_id);
    let products = await rentalModel.find({short_id:{$in:prodShortIds_ar}})
    res.json({products,order});
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

router.post("/", auth, async(req,res) => {
  let validBody = validateRentalOrder(req.body);
  if (validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({_id:req.tokenData._id});
    req.body.name = user.name;
    req.body.address = user.address;
    req.body.phone = user.phone;
    req.body.email = user.email;
    req.body.phone = user.phone;
    let newOrder = new RentalOrderModel(req.body);
    newOrder.user_id = req.tokenData._id;
    await newOrder.save()
    let car = await rentalModel.findOne({short_id:newOrder.car_short_id});
    let newDate = {
      start:newOrder.startDate,
      end:newOrder.endDate
    }
    car.in_use.push(newDate)
    let data = await rentalModel.updateOne({short_id:newOrder.car_short_id},car);
    console.log(data);
    return res.status(201).json(newOrder);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})


router.patch("/orderPaid", auth ,  async(req,res) => {
  try{
    let tokenId = req.body.tokenId;
    let orderId = req.body.orderId;
    let realPay = (req.body.realPay == "yes")
    let car_short_id = req.body.car_short_id;
    let paypalData = await payPalAuth(tokenId,orderId,realPay)
    if(paypalData.status != "COMPLETED"){
      return res.status(401).json({err_msg:"There problem in the payment"})
    }
    let product = await rentalModel.findOne({short_id:car_short_id})
    // product.qty-=1;
      let prodUpdate = await rentalModel.updateOne({_id:product._id},product)
    res.json(prodUpdate);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

router.delete("/:delId", authAdmin ,  async(req,res) => {
  let orderId = req.params.delId;
  try{
    let data = await RentalOrderModel.deleteOne({_id:orderId})
    res.json(data);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

module.exports = router;