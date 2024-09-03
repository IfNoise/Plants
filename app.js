const express=require("express")
const multer  = require('multer')
const config=require("config")
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cors=require("cors")
const path=require('path')
const sharp = require('sharp');
const Photo=require('./models/Photo')
const fs=require('fs')

const PORT=config.get("port")||5000

const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({extended:true}))
app.use('/api/auth',require('./routes/auth.routes.js'))
app.use('/api/tray',require('./routes/tray.routes.js'))
app.use('/api/plant',require('./routes/plant.routes.js'))
app.use('/api/strain',require('./routes/strain.routes.js'))
app.use('/api/cycle',require('./routes/cycle.routes.js'))
app.use('/api/gallery',require('./routes/gallery.routes.js'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext= file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const upload = multer({ storage: storage });

app.post('/api/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files - массив файлов `photos`
  // req.body сохранит текстовые поля, если они будут
  if (!req.files) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }
  req.files.forEach(async (file) => {
    await sharp(file.path)
      .resize(200, 200)
      .toFile(`uploads/thumbnails/${file.filename}`,(err,info)=>{
        if(err)console.log(err)
          else console.log(info)


      });
  }
  );
  res.status(200).send({ message: 'Files uploaded successfully.', files: req.files });
});
app.get('/api/photos/make_thumbnails', async(req, res) => {
  const photos=await Photo.find({})
  photos.forEach(async (photo) => {
    const filename="uploads/"+(photo.src?.includes("gallery/")?photo.src.split("/")[1]:photo.src)
    console.log(filename)
    if(fs.existsSync(`uploads/thumbnails/${filename}`))return
    await sharp(filename)
      .resize(200)
      .toFile(`uploads/thumbnails/${filename}`)

  });

});
app.use('/gallery', express.static(path.join(__dirname, 'uploads')))
app.use('/gallery/thumbnails', express.static(path.join(__dirname, 'uploads','thumbnails')))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client-vite', 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client-vite', 'dist', 'index.html'))
  })
}



async function start(){
  try {
    await mongoose.connect(config.get('mongodbUri'),{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT,()=>console.log(`Server has been started at ${PORT}`)
    )
  } catch (error) {
    console.log('SErver error',error.message)
    process.exit(1)
  }
}

start()




