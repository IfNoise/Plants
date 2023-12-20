const { Router } = require("express");
const TrayItem = require("../models/TrayItem");
const Plant = require("../models/Plant");
const auth = require("../middlewares/auth.middleware");
const router = Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    const data = await TrayItem.find({}, "plantId").exec();
    if (data) {
      const tray = await Promise.all(
        data.map(async (plant, id) => {
          const inputPlant = await Plant.findById(plant.plantId);
          let start;
          if (inputPlant.actions[0]) {
            start = inputPlant.actions[0].date.toDateString();
          } else {
            start = "none";
          }
          const result = {
            id: inputPlant._id,
            strain: inputPlant.strain,
            pheno: inputPlant.pheno,
            type: inputPlant.type,
            start,
          };
          return result;
        })
      );
      res.json({ tray });
    } else {
      res.json({});
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/print", async (req, res) => {
  try {
    const data = await TrayItem.find({}, "plantId").exec();

    const tray = await Promise.all(
      data.map(async (plant, id) => {
        const inputPlant = await Plant.findById(plant.plantId);
        let start;
        if (inputPlant.actions[0]) {
          start = inputPlant.actions[0].date.toDateString();
        } else {
          start = "none";
        }
        const result = {
          id: inputPlant._id,
          strain: inputPlant.strain,
          pheno: inputPlant.pheno,
          type: inputPlant.type,
          start,
        };
        return result;
      })
    );
    fs.writeFileSync("/srv/data.json", JSON.stringify(tray));
    res.json({ tray });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    await TrayItem.create({ plantId: req.body.plantId });
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
