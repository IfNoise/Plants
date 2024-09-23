const { Router } = require("express");
const Plant = require("../models/Plant");
const Photo = require("../models/Photo");
const crypto = require("crypto");
const router = Router();
const Strain = require("../models/Strain");
const plantMap = require("../config/map");

router.post("/new_plant", async (req, res) => {
  try {
    const number = parseInt(req.body.number);
    if (!number || number === 0 || number < 0) {
      throw new Error("Number of clones must be greater than 0");
    }

    //const user = await User.findById(req.user.userId)
    const group = crypto.randomBytes(8).toString("hex");
    startDate = Date.now();
    let strain;
    if (req.body?.strain) {
      strain = await Strain.findById(req.body.strain);
    } else if (req.body?.strainName) {
      strain = await Strain.findOne({ name: req.body.strainName });
    } else {
      throw new Error("Strain not found");
    }
    if (!strain) {
      throw new Error("Strain not found");
    }
    console.log(strain);
    const newPlants = [];
    const sourceType = strain.sourceType;
    const gender = strain.sourceType === "Seed" ? "undefined" : "Female";
    const firstAction = {
      date: Date.now(),
      //author:user.username,
      type: "Start",
      source: strain._id,
      group,
    };
    if (sourceType === "Clone") {
      for (let index = 0; index < number; index++) {
        newPlants.push({
          strain: strain.name,
          pheno: req.body.code,
          gender,
          group,
          startDate,
          currentAddress: {
            building: "Hangar1",
            room: "Laboratory",
            row: 0,
            shelf: 0,
            rack: 0,
            tray: 0,
          },
          type: "Clone",
          state: "Cloning",
          actions: [firstAction],
        });
      }
    } else if (sourceType === "Seed") {
      const start = strain?.lastIdx || 1;
      for (let index = 1; index <= number; index++) {
        let pheno = strain.code + "#" + (index + start).toString();

        newPlants.push({
          startDate,
          strain: strain.name,
          pheno,
          gender,
          group,

          currentAddress: {
            building: "Hangar1",
            room: "Laboratory",
            row: 0,
            shelf: 0,
            rack: 0,
            tray: 0,
            number: 0,
          },
          type: "Seed",
          state: "Germination",
          actions: [firstAction],
        });
        strain.phenos.push({
          idx: index,
        });
      }
    }
    console.log("New PLANTS!!!",newPlants);
    const result = await Plant.insertMany(newPlants);
    console.log(result);
    if (result.length === 0) {
      return res.status(500).json({ message: "Error while creating plants" });
    } else if (result.length === number) {
      console.log("Plants created successfully");
      const currentCounter = strain.counter;
      const currentLIdx = strain?.lastIdx || 0;
      const newCounter = currentCounter - number;
      strain.set("counter", newCounter);
      strain.set("lastIdx", currentLIdx + number);
      await strain.save();
      res.status(201).json(strain);
    }
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
      action = { type: data.actionType, date: data?.date || Date.now() };
      const plant = await Plant.findById(idx);

      switch (data.actionType) {
        case "Note": {
          if (data.note) action.note = data.note;
          break;
        }
        case "Picking": {
          if (plant?.potSize && plant.potSize === data.potSize) {
            console.log("same pot size");

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
          action.oldAddress = { ...plant.currentAddress };
          action.newAddress = { ...data.address };

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
          plant.set("currentAddress", {});
          action.reason = data.reason;

          break;
        }
        case "Harvest": {
          plant.set("state", "Harvested");
          plant.set("currentAddress", {});
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
          action.group = group;
          const newClones = [];
          for (let index = 0; index < number; index++) {
            let firstAction = {
              date: Date.now(),
              type: "Start",
              source: plant._id,
              address: data.address,
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
        case "AddPhoto": {
          if (data?.photos?.length === 0) {
            action = null;
            throw new Error("No photos to add");
          }
          action.photos = data.photos;
          const newPhotos = data.photos.map((photo) => {
            if (plant.photos.indexOf(photo) === -1) {
              //days from last state change
              const chAct = plant.actions.filter(
                (action) =>
                  action.type === "Start" ||
                  action.type === "Picking" ||
                  action.type === "Blooming" ||
                  action.type === "MakeMother"
              );
              const LastStateChenge = new Date(chAct[chAct.length - 1].date);
              //days from last state change
              const ageOfState = Math.floor(
                (Date.now() - LastStateChenge) / (1000 * 60 * 60 * 24)
              );
              plant.photos.push(photo);
              return {
                src: `${photo}`,
                date: Date.now(),
                strain: plant.strain,
                pheno: plant.pheno,
                state: plant.state,
                plantId: plant._id,
                ageOfState,
              };
            }
          });
          const result = await Photo.insertMany(newPhotos);
          console.log(result);
          if (result.length === 0) {
            action = null;
            throw new Error("Error while adding photos");
          }
          break;
        }
        case "Cutting": {
          break;
        }
        case "Insecticide": {
          break;
        }
        default: {
          throw new Error("Action type not found");
        }
      }
      if (action !== null) {
        plant.actions.push(action);
        await plant.save();
        return res.json({ message: "Ok" });
      } else {
        throw new Error("Action not created");
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/plants_map", async (req, res) => {
  try {
    const plants = await Plant.find(
      { currentAddress: { $ne: {} } },
      {
        id: 1,
        pheno: 1,
        strain: 1,
        state: 1,
        potSize: 1,
        startDate: 1,
        currentAddress: 1,
      }
    );
    const map = JSON.parse(JSON.stringify(plantMap));
    Object.assign;
    plants.forEach((plant) => {
      const { building, room, row, shelf, rack, tray } = plant.currentAddress;
      const { id, pheno, state, strain, startDate, potSize, currentAddress } =
        plant;
      const plantData = {
        id,
        pheno,
        strain,
        state,
        startDate,
        potSize,
        currentAddress,
      };
      if (!building || Object.keys(map).indexOf(building) === -1) return;
      if (!room) return;
      const roomName = room.split(" ").join("_");
      if (Object.keys(map[building]).indexOf(roomName) === -1) return;
      if (room === "Laboratory" && rack && shelf) {
        const racks = map[building][roomName]?.racks;
        let shelfNum = racks[rack - 1]?.shelfs.length - shelf;
        const shelfTmp = racks[rack - 1]?.shelfs[shelfNum];
        shelfTmp?.plants.push(plantData);
      } else if (room && row && tray) {
        const rows = map[building][roomName]?.rows;
        let trayNum;
        if (rows[row - 1]?.numeration === "Up") {
          trayNum = rows[row - 1].trays.length - tray;
          const trayTmp = rows[row - 1]?.trays[trayNum];
          trayTmp?.plants.push(plantData);
          map[building][roomName]["totalPlants"]++;
        } else {
          trayNum = tray - 1;
          const trayTmp = rows[row - 1]?.trays[trayNum];
          trayTmp?.plants.unshift(plantData);
          map[building][roomName]["totalPlants"]++;
        }
      }
    });
    res.json(map);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
      //const plants=["669b9435021e1d69b9481ed5","669b9435021e1d69b9481ed6","669b9435021e1d69b9481ed7"]
      const plants=["66692921b66182d2da37f6b1","66692921b66182d2da37f6af","66692921b66182d2da37f6b0","66692b9b8b1eebc0fb32070a"]
      plants.map(async (idx) => {
      const plant = await Plant.findById(idx);
      // plant.actions.pop();
      plant.set("gender","Female");
      await plant.save();
  })

    res.json({ message: "Ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
);
router.delete("/", async (req, res) => {
  try {
    const filter = req.body.filter;
    const plants = await Plant.deleteMany(filter);
    if (plants.length === 0) {
      throw new Error("Plants not found");
    }else{
      res.json({ message: "Plant deleted" });
    } 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

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
module.exports = router;
