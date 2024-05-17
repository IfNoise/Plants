const { Router } = require("express");
const Plant = require("../models/Plant");
const crypto = require("crypto");
const router = Router();
const Strain = require("../models/Strain");

router.post("/new_plant", async (req, res) => {
  const number = req.body.number;
  try {
    //const user = await User.findById(req.user.userId)
    const group = crypto.randomBytes(8).toString("hex");
    let strain;
    if (req.body?.strain) {
      strain = await Strain.findById(req.body.strain);
    } else if (req.body?.strainName) {
      strain = await Strain.findOne({ name: req.body.strainName });
    }
    const newPlants = [];
    const sourceType = strain.sourceType;
    const gender = strain.sourceType === "Seed" ? "undefined" : "Female";
    const firstAction = {
      date: Date.now(),
      //author:user.username,
      type: "Start",
      source: strain._id,
    };
    if (sourceType === "Clone") {
      for (let index = 0; index < number; index++) {
        newPlants.push({
          strain: strain.name,
          pheno: strain.code,
          gender,
          startDate: Date.now(),
          currentAddress: {
            building: "Hangar1",
            room: "Laboratory",
            row: 0,
            shelf: 0,
            rack: 0,
            tray: 0,
            number: 0,
          },
          type: "Clone",
          state: "Cloning",
          actions: [firstAction],
        });
      }
    } else if (sourceType === "Seed") {
      const start = strain?.lastIdx || 1;
      for (let index = start; index <= number; index++) {
        let pheno = strain.code + "#" + index;

        newPlants.push({
          strain: strain.name,
          pheno,
          gender,
          group,
          startDate: Date.now(),
          type: "Seed",
          state: "Germination",
          actions: [firstAction],
        });
        strain.phenos.push({
          idx: index,
        });
      }
    }

    await Plant.insertMany(newPlants);
    const currentCounter = strain.counter;
    const currentLIdx = strain?.lastIdx || 0;
    const newCounter = currentCounter - number;
    strain.set("counter", newCounter);
    strain.set("lastIdx", currentLIdx + number);
    await strain.save();
    res.status(201).json(strain);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/strains", async (req, res) => {
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

router.get("/plants", async (req, res) => {
  try {
    const filter = JSON.parse(req.query.filter);
    console.log("filter", filter);

    const plants = await Plant.find(filter);
    res.json(plants);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/new_action", async (req, res) => {
  try {
    const data = req.body.action;
    const id = req.body.id;
    let action;
    id.map(async (idx) => {
      action = { type: data.actionType, date: Date.now() };
      const plant = await Plant.findById(idx);

      switch (action.type) {
        case "Note": {
          if (data.note) action.note = data.note;
          break;
        }
        case "Picking": {
          if (plant?.potSize && plant.potSize === data.potSize) {
            console.log('same pot size')
            
            action = null;
            break;
          }
          if (plant.state === "Cloning" || plant.state === "Germination") {
            plant.set("state", "Growing");
          }
          action.potSize = data.potSize;
          plant.set("potSize", data.potSize);
          break;
        }
        case "Relocation": {
          if (plant.currentAddress === data.address) {
            action = null;
            break;
          }
          action.oldAddress = plant.currentAddress;

          plant.set("currentAddress", data.address);
          break;
        }
        case "Blooming": {
          if (plant.state === "Blooming") {
            action = null;
            break;
          }
          plant.set("state", "Blooming");
          break;
        }
        case "Stop": {
          if (plant.state === "Stopped") {
            action = null;
            break;
          }
          plant.set("state", "Stopped");
          if (data?.reason === "Other") {
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
          if (plant.state === "MotherPlant") {
            action = null;
            break;
          }
          plant.set("state", "MotherPlant");
          plant.set("cloneCounter", 0);
          break;
        }
        case "SetGender": {
          if (plant.gender != "undefined") {
            action = null;
            break;
          }
          plant.set("gender", data.gender);
          break;
        }
        case "CuttingClones": {
          const number = data.clonesNumber;
          console.log(number);
          const group = crypto.randomBytes(8).toString("hex");
          action.clonesNumber = number;
          const newClones = [];
          for (let index = 0; index < number; index++) {
            let firstAction = {
              date: Date.now(),
              type: "Start",
              source: plant._id,
            };
            newClones.push({
              strain: plant.strain,
              pheno: plant.pheno,
              gender: plant?.gender || "undefined",
              type: "Clone",
              group,
              motherPlant: plant._id,
              startDate: Date.now(),
              state: "Cloning",
              currentAddress: data.address,
              actions: [firstAction],
            });
          }

          await Plant.insertMany(newClones);
          const current = plant?.cloneCounter || 0;
          const newCounter = current + number;
          const currentMaxClones = plant?.maxClones || 0;
          const maxClones =
            currentMaxClones < number ? number : currentMaxClones;
          plant.set("cloneCounter", newCounter);
          plant.set("maxClones", maxClones);
          break;
        }
        default: {
          return res.json({ message: "Wrong action type" });
        }
      }
      if (action !== null) {
        plant.actions.push(action);
        await plant.save();
      }
    });

    return res.json({ message: "Ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/test", async (req, res) => {
  try {
    const plants = await Plant.find({
      state: "Stopped",
      "actions.type": "MakeMother",
    });
    result = plants.map(async (plant) => {
      const res = await Plant.findByIdAndUpdate(
        plant._id,
        { state: "MotherPlant" },
        { new: true, useFindAndModify: false }
      );
    });
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

router.get("/plant_counts", async (req, res) => {
  try {
    const plantCounts = await Plant.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
    ]);
    res.json(plantCounts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
