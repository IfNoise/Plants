const { Router } = require("express");
const Plant = require("../models/Plant");
const Cycle = require("../models/Cycle");
//const auth = require("../middlewares/auth.middleware");
const router = Router();

router.get("/", async (req, res) => {
  const filter = JSON.parse(req.query.filter??'{}');
  try {

    const data = await Cycle.find(filter);

      res.json(data);
  
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.post("/new", async (req, res) => {
 
  try {
    const cycle={
      startDate: req.body.startDate??Date.now(),
      address: req.body.address??{},
      plan: req.body.plan??[],
      endPoints: req.body.endPoints??{cloning:14,growing:14,blooming:56,flushing:7}
    }

    await Cycle.create(cycle);
    res.json({ message: "Cycle is started" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;