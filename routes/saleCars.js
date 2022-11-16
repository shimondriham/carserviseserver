const express = require("express");
const { random } = require("lodash")
const { authAdmin, auth } = require("../middlewares/auth");
const { saleModel, validateSale } = require("../models/saleModel");
const router = express.Router();


router.get("/", async (req, res) => {
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let cat = req.query.cat || null
  try {
    objFind = (cat) ? { cat_short_id: cat } : {}
    let data = await saleModel.find(objFind)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let searchQ = req.query.s;
  try {
    let searchReg = new RegExp(searchQ, "i")
    let data = await saleModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});


router.get("/amount", async (req, res) => {
  try {
    let cat = req.query.cat || null
    objFind = (cat) ? { cat_short_id: cat } : {}
    let data = await saleModel.countDocuments(objFind);
    res.json({ amount: data });
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id
    let data = await saleModel.findOne({ _id: id })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.post("/", authAdmin, async (req, res) => {
  let validBody = validateSale(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let product = new saleModel(req.body);
    product.user_id = req.tokenData._id;
    product.short_id = await genShortId();
    await product.save();
    res.status(201).json(product);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/:idEdit", authAdmin, async (req, res) => {
  let validBody = validateSale(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await saleModel.updateOne({ _id: idEdit }, req.body);
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:idDel", authAdmin, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await saleModel.deleteOne({ _id: idDel });
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

const genShortId = async () => {
  let flag = true;
  let rnd;
  while (flag) {
    rnd = random(0, 999999)
    try {
      let data = await saleModel.findOne({ short_id: rnd })
      if (!data) {
        flag = false;
      }
    }
    catch (err) {
      console.log(err);
      flag = false;
      return res.status(500).json(err);
    }
  }
  return rnd;
};

router.patch("/addQty/:idAdd", authAdmin, async (req, res) => {
  try {
    let idAdd = req.params.idAdd;
    let data = await saleModel.findOne({ _id: idAdd });
    data.qty++;
    let update = await saleModel.updateOne({ _id: idAdd }, data)
    res.status(200).json(update);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.patch("/removeQty/:idDel", authAdmin, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await saleModel.findOne({ _id: idDel });
    data.qty--;
    let update = await saleModel.updateOne({ _id: idDel }, data)
    res.status(200).json(update);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


module.exports = router;