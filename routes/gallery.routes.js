const {Router} = require('express');
const Photo = require('../models/Photo');
const router = Router()

router.get('/',async (req,res)=>{
  try {
    const photos=await Photo.find()
    res.json(photos)
  } catch (error) {
    res.status(500).json({message:'Something went wrong, try again'})
  }
})
router.get(/:pheno/,async (req,res)=>{
  try {
    const pheno=req.params.pheno
    
    const photos=await Photo.find({pheno})
    res.json(photos)
  } catch (error) {
    res.status(500).json({message:'Something went wrong, try again'})
  }
})
module.exports = router;