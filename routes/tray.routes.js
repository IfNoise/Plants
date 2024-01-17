const { Router } = require("express");
const TrayItem = require("../models/TrayItem");
const Plant = require("../models/Plant");
const auth = require("../middlewares/auth.middleware");
const router = Router();
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { Image,createCanvas } = require('canvas')
const cups = require("node-cups");
const QRCode = require("qrcode");

router.get("/", async (req, res) => {
  try {
    const data = await TrayItem.find({}, "plantId").exec();

    const tray = await Promise.all(
      data.map(async (plant) => {
        let result;
        await Plant.findById(plant.plantId).then((inputPlant) => {
          let start;
          if (inputPlant.actions.length > 0) {
            start = inputPlant.actions[0].date.toDateString();
          } else {
            start = "none";
          }
          result = {
            id: inputPlant._id,
            strain: inputPlant.strain,
            pheno: inputPlant.pheno,
            type: inputPlant.type,
            start,
          };
        });

        return result;
      })
    );
    res.json({ tray });
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
        if (inputPlant.actions.length > 0) {
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
    await Promise.all(tray.map(async(plant)=>{
      const id=plant.id.toString()
      const qrCodeImagePath ="./qr/"+ id+".png";
      await QRCode.toFile(qrCodeImagePath,id,{width:85,height:85,margin:2});
    }) )
    // const doc = new PDFDocument({autoFirstPage: false});
    // doc.pipe(fs.createWriteStream("label.pdf"));
    //   tray.forEach((plant) => {
    //     const id=plant.id.toString()
    //     const qrCodeImagePath = id+".png";
    //     doc.addPage({size:[142,85],layout:"portrait"})
    //     doc.text(plant.pheno,0,75).font('Times-Roman', 8);
    //     doc.image(qrCodeImagePath, { width: 50, height: 50});
    //     // doc.circle(10, 10, 5)
    //     // // doc.roundedRect(1, 1, 139,81, 4)
    //     // doc.stroke()
        
    //   })
    
    // doc.end();
    const myPDFcanvas = createCanvas(142, 85, 'pdf')
    const ctx = myPDFcanvas.getContext('2d')
      tray.forEach((plant) => {
        const id=plant.id.toString()
        const qrCodeImagePath = './qr/'+id+".png";
        const img = new Image()
        img.src = qrCodeImagePath
        ctx.drawImage(img, 55,0,85,85)
        ctx.font = 'bold 16px Arial '
        ctx.fillText(plant.pheno, 3, 17,54)
        ctx.font = ' 10px Arial '
        ctx.fillText(plant.strain, 3, 28,52)
        ctx.font = '6px Arial '
        ctx.fillText(plant.type, 3, 36,52)
        ctx.font = '8px Arial '
        ctx.fillText('start:'+plant.start, 3, 49,52)
        ctx.addPage(142,85)
        fs.rm(qrCodeImagePath,(err)=>{
          console.log(err)
          
        })
  })
      const buff = myPDFcanvas.toBuffer('application/pdf')
      fs.writeFile('label.pdf', buff, function (err) {
        if (err) throw err
      
        console.log('created label.pdf')
      })
    const printerNames = await cups.getPrinterNames();
    console.log(printerNames);
    const options = {
      destination: printerNames[2],
      jobTitle: "Label Printing",
      copies: 1,
    };
    cups.printFile("label.pdf", options, (err, jobID) => {
      if (err) {
        console.error(err);
        res.status(500).send("Ошибка при печати этикетки");
      } else {
        console.log(`Этикетка успешно отправлена на печать. Job ID: ${jobID}`);
        res.send("Этикетка успешно отправлена на печать.");
        
      }
    });
    res.json({ tray });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  const plants = [...req.body];

  try {
    if (plants.length > 0) {
      const request = plants.map((item) => ({ plantId: item }));
      await TrayItem.insertMany(request);
    }
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
