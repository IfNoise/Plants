const {Router} = require('express');
const Photo = require('../models/Photo');
const router = Router()

router.get('/',async (req,res)=>{
  try {
    const filter = JSON.parse(req.query.filter);
    const photos=await Photo.find(filter)
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
router.delete('/:id',async (req,res)=>{
  try {
    const id=req.params.id
    const photo=await Photo.findById(id)
    fs.unlinkSync
    await photo.remove()
    res.json({message:'Photo deleted'})
  } catch (error) {
    res.status(500).json({message:'Something went wrong, try again'})
  }
}
)
module.exports = router;