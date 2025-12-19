require('dotenv').config();
const express=require("express")
const multer  = require('multer')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cors=require("cors")
const path=require('path')
const sharp = require('sharp');
const Photo=require('./models/Photo')
const fs=require('fs')

const PORT=process.env.PORT||5000

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

// Создаем папку для миниатюр если её нет
const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

app.post('/api/photos/upload', upload.array('photos', 12), async function (req, res, next) {
  // req.files - массив файлов `photos`
  // req.body сохранит текстовые поля, если они будут
  if (!req.files) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }
  
  try {
    // Используем Promise.all для параллельного создания миниатюр
    await Promise.all(
      req.files.map(async (file) => {
        console.log(file);
        const thumbnailPath = path.join(__dirname, 'uploads', 'thumbnails', file.filename);
        
        await sharp(file.path)
          .resize(200, 200, {
            fit: 'cover',
            position: 'center'
          })
          .toFile(thumbnailPath);
        
        console.log(`Thumbnail created: ${thumbnailPath}`);
      })
    );
    
    res.status(200).send({ message: 'Files uploaded successfully.', files: req.files });
  } catch (error) {
    console.error('Error creating thumbnails:', error);
    res.status(500).send({ message: 'Error creating thumbnails', error: error.message });
  }
});
app.get('/api/photos/make_thumbnails', async(req, res) => {
  try {
    const photos = await Photo.find({});
    
    await Promise.all(
      photos.map(async (photo) => {
        const filename = photo.src?.includes("gallery/") ? photo.src.split("/")[1] : photo.src;
        console.log("Filename", filename);
        
        const filePath = path.join(__dirname, 'uploads', filename);
        console.log("Path:", filePath);
        
        const thumbPath = path.join(__dirname, 'uploads', 'thumbnails', filename);
        console.log("Thumb:", thumbPath);
        
        // Проверяем существование исходного файла
        if (fs.existsSync(filePath)) {
          await sharp(filePath)
            .resize(200, 200, {
              fit: 'cover',
              position: 'center'
            })
            .toFile(thumbPath);
          
          console.log(`Thumbnail created for ${filename}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      })
    );
    
    res.status(200).send({ message: 'Thumbnails created successfully.' });
  } catch (error) {
    console.error('Error creating thumbnails:', error);
    res.status(500).send({ message: 'Error creating thumbnails', error: error.message });
  }
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
    await mongoose.connect(process.env.MONGODB_URI,{
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




