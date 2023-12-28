const { Router } = require("express");
const Plant = require("../models/Plant");
const Action = require("../models/Action");
const User = require("../models/User");
const auth = require("../middlewares/auth.middleware");
const router = Router();
const fs = require("fs");
const Strain = require("../models/Strain");

router.post("/new_plant", auth, async (req, res) => {
  const form=req.body.form
  const number = form.seedsNumber;
  try {
    const user = await User.findById(req.user.userId)
    const strain = await Strain.findById(req.body.strain)
    const firstAction = {
      date: Date.now(),
      author:user.username,
      type: "Start",
      gender:"undefined",
      source: strain._id,
    };  
    const start=strain?.lastIdx||1
    const newPlants = [];
    const newPhenos=[]
    for (let index = start; index <= number;index++) {
      let pheno=strain.code+'#'+index;
      
      newPlants.push({
        strain: strain.name,
        pheno,
        type: "Seed",
        state: "Germination",
        actions: [firstAction],
      });
      strain.phenos.push({
        idx:index
      })
    }

    await Plant.insertMany(newPlants);
    const currentCounter = strain.counter;
    const currentLIdx=strain?.lastIdx||0;
    const newCounter = currentCounter - number;
    strain.set("counter", newCounter);
    strain.set('lastIdx',currentLIdx+number);
    await strain.save();
    res.status(201).json(strain);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/strains", auth, async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$strain",
          pheno: { $addToSet: "$pheno" },
        },
      },
      {
        $project: {
          _id: 0,
          strain: "$_id",
          pheno: 1,
        },
      },
    ];
    const result = await Plant.aggregate(pipeline).exec();
    const groups = await Plant.distinct("group");
    res.json({ strains: result, groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.get("/mothers", auth, async (req, res) => {
  try {
    const plant = await Plant.find({ state: "MotherPlant" });
    res.json(plant);
  } catch (error) {
    return res.status(500).json({ message: "Something wants wrong3" });
  }
});
router.get("/clones", auth, async (req, res) => {
  try {
    const plant = await Plant.find({ state: "Cloning" });
    res.json(plant);
  } catch (error) {
    return res.status(500).json({ message: "Something wants wrong4" });
  }
});
router.get("/plants", auth, async (req, res) => {
  try {
    const filter = JSON.parse(req.query.filter);

    const plants = await Plant.find(filter);
    res.json(plants);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/new_action", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    const data = req.body.action;
    const id = req.body.id;
    const action = {};
    action.author=user.username;
    id.map(async (idx) => {
      const plant = await Plant.findById(idx);
      action.type = data.actionType;
      switch (action.type) {
        case "Note": {
          if (data.note) action.note = data.note;
          break;
        }
        case "Picking": {
          if (plant.state === "Cloning" || plant.state === "Germination") {
            plant.set("state", "Growing");
          }
          action.potSize = data.potSize;
          break;
        }
        case "Relocation": {
          action.oldAddress = plant.currentAddress;

          plant.set("currentAddress", data.address);
          break;
        }
        case "Blooming": {
          plant.set("state", "Blooming");
          break;
        }
        case "Stop": {
          plant.set("state", "Stopped");
          if (data?.reason == "Other") {
            action.userReason = data.userReason;
          }

          action.reason = data.reason;

          break;
        }
        case "Harvest": {
          plant.set("state", "Harvested");
          break;
        }
        case "MakeMother": {
          plant.set("state", "MotherPlant");
          plant.set("cloneCounter", 0);
          break;
        }
        case "SetGender" :{
          plant.set("gender",data.gender)
          break;
        }
        case "CuttingClones": {
          const number = data.clonesNumber;
          console.log(number);

          action.clonesNumber = number;
          const newClones = [];
          for (let index = 0; index < number; index++) {
            let firstAction = {
              date: Date.now(),
              type: "Start",
              source: plant.id,
            };
            newClones.push({
              strain: plant.strain,
              pheno: plant.pheno,
              gender:plant?.gender||"undefined",
              type: "Clone",
              state: "Cloning",
              currentAddress: data.newAddress,
              actions: [firstAction],
            });
          }

          await Plant.insertMany(newClones);
          const current = plant.cloneCounter || 0;
          const newCounter = current + number;

          console.log(newCounter);

          plant.set("cloneCounter", newCounter);
          break;
        }
        default:
          break;
      }
      plant.actions.push(action);
      await plant.save();
    });

    res.json({ message: "Ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
