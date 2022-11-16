const express = require("express");
const { random } = require("lodash");
const { auth, authAdmin } = require("../middlewares/auth");
const { CooperativeModel, validateCooperative } = require("../models/cooperativeModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let data = await CooperativeModel.find({})
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get("/myCars", auth, async (req, res) => {
  try {
    let data = await CooperativeModel.find({ user_id: req.tokenData._id })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get("/allCars", async (req, res) => {
  try {
    let data = await CooperativeModel.find({})
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id
    let data = await CooperativeModel.findOne({ _id: id })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateCooperative(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let car = new CooperativeModel(req.body);
    car.user_id = req.tokenData._id;
    car.short_id = await genShortId();
    await car.save();
    res.status(201).json(car);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validateCooperative(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await CooperativeModel.updateOne({ _id: idEdit }, req.body);
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
    let data = await CooperativeModel.deleteOne({ _id: idDel });
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
      let data = await CooperativeModel.findOne({ short_id: rnd })
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


module.exports = router;