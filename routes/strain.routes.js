const { Router } = require("express");
const Plant = require("../models/Plant");
const auth = require("../middlewares/auth.middleware");
const router = Router();
const Strain = require("../models/Strain");

router.get("/", async (req, res) => {
  const filter = JSON.parse(req.query.filter);
  try {

    const data = await Strain.find(filter);

      res.json(data);
  
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.post("/add", async (req, res) => {
 
  try {
      const number = parseInt(req.body.number);
      if(!number||number<=0||!req.body.seedBank){
        return res.status(400).json({ message: "Some fields are ex" });
      }
 
    const strain={
      name:req.body.name,
      code:req.body.code,
      seedBank:req.body.seedBank,
      sourceType:req.body.sourceType,
      description:req.body.description,
      seedType:null,
      counter:0,
    }
    if(req.body.sourceType==='Seed'){
      strain.seedType=req.body?.seedType;
      strain.counter=number;
    }
    await Strain.create(strain);
    res.json({ message: "Strain is added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const strains = await Strain.find({seedType:{$exists:true}});
    

    strains.forEach(async (strain) => {
      strain.set({ sourceType: "Seed"})
      await strain.save();
    }
    );
    res.json({ message: "Strains are updated" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
);


module.exports = router;