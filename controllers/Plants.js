import Plant from "../models/Plant.js";
import Strain from "../models/Strain.js";
import Photo from "../models/Photo.js";
import crypto from "crypto";
import plantMap from "../config/map.js";


const NewPlant = async (req, res, next) => {
  const number = parseInt(req.body.form.seedsNumber);
  try {
    //const user = await User.findById(req.user.userId)
    const group = crypto.randomBytes(8).toString("hex");
    startDate = Date.now();
    let strain;
    if (req.body?.strain) {
      strain = await Strain.findById(req.body.strain);
    } else if (req.body?.strainName) {
      strain = await Strain.findOne({ name: req.body.strainName });
    } else {
      next(new Error("Strain not found"));
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
          startDate,
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

    const result = await Plant.insertMany(newPlants);
    if (result.length === 0) {
      return res.status(500).json({ message: "Error while creating plants" });
    } else if (result.length === number) {
      const currentCounter = strain.counter;
      const currentLIdx = strain?.lastIdx || 0;
      const newCounter = currentCounter - number;
      strain.set("counter", newCounter);
      strain.set("lastIdx", currentLIdx + number);
      await strain.save();
      res.status(201).json(strain);
    }
  } catch (error) {
    next(error);
  }
};

const GetPlants = async (req, res, next) => {
  try {
    const filter = JSON.parse(req.query.filter);
    const plants = await Plant.find(filter);
    res.json(plants);
  } catch (error) {
    next(error);
  }
};

const NewAction = async (req, res) => {
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
            next(new Error("No photos to add"));
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
          if (result.length === 0) {
            action = null;
            next(new Error("Error while adding photos"));
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
          next(new Error("Action not found"));
        }
      }
      if (action !== null) {
        plant.actions.push(action);
        await plant.save();
        return res.json({ message: "Ok" });
      } else {
        next(new Error("Action not saved"));
      }
    });
  } catch (error) {
    next(error);
  }
};

const GetMap = async (req, res) => {
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
    next(error);
  }
};

export default { NewPlant, GetPlants, NewAction, GetMap };
