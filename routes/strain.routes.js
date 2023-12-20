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
    const strain={
      name:req.body.name,
      seedBank:req.body.seedBank,
      counter:req.body.number,
      description:req.body.description
    }

    await Strain.create(strain);
    res.json({ message: "Item is added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;