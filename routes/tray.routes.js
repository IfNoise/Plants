const { Router } = require("express");
const TrayItem = require("../models/TrayItem");
const Plant = require("../models/Plant");
const auth = require("../middlewares/auth.middleware");
const router = Router();
const fs = require("fs");
const { Image,createCanvas } = require('canvas')
const cups = require("node-cups");
const QRCode = require("qrcode");

router.get("/", async (req, res) => {
  try {
    const data = await TrayItem.find({}).exec();
    const ids = data.map((item) => item.plantId);
    const tray = await Plant.find({_id:ids}).exec()
    res.json({ tray });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



router.post("/add", async (req, res) => {
  const plants = [...req.body];

  try {
    if (plants.length > 0) {
      const request = plants.map((item) => ({ plantId: item }));
      await TrayItem.insertMany(request);
    }
    res.json({ message: "Item is added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/remove", async (req, res) => {
  try {
    await TrayItem.deleteOne({ plantId: req.body.plantId });
    res.json({ message: "Item is removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/clear", async (req, res) => {
  try {
    await TrayItem.deleteMany({});
    res.json({ message: "Tray is empty" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
