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
  console.log(`[INIT] Created thumbnails directory: ${thumbnailsDir}`);
} else {
  console.log(`[INIT] Thumbnails directory exists: ${thumbnailsDir}`);
}

app.post('/api/photos/upload', upload.array('photos', 12), async function (req, res, next) {
  // req.files - массив файлов `photos`
  // req.body сохранит текстовые поля, если они будут
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }
  
  console.log(`[UPLOAD] Received ${req.files.length} file(s)`);
  
  try {
    // Создаем миниатюры последовательно для лучшей отладки
    const results = [];
    for (const file of req.files) {
      try {
        console.log(`[UPLOAD] Processing file: ${file.filename}`);
        console.log(`[UPLOAD] Original path: ${file.path}`);
        
        const thumbnailPath = path.join(__dirname, 'uploads', 'thumbnails', file.filename);
        console.log(`[UPLOAD] Thumbnail path: ${thumbnailPath}`);
        
        // Проверяем существование исходного файла
        if (!fs.existsSync(file.path)) {
          console.error(`[UPLOAD] Source file not found: ${file.path}`);
          results.push({ filename: file.filename, success: false, error: 'Source file not found' });
          continue;
        }
        
        await sharp(file.path)
          .resize(200, 200, {
            fit: 'cover',
            position: 'center'
          })
          .toFile(thumbnailPath);
        
        console.log(`[UPLOAD] ✓ Thumbnail created successfully: ${file.filename}`);
        results.push({ filename: file.filename, success: true });
      } catch (fileError) {
        console.error(`[UPLOAD] ✗ Error processing ${file.filename}:`, fileError.message);
        results.push({ filename: file.filename, success: false, error: fileError.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`[UPLOAD] Complete: ${successCount}/${req.files.length} thumbnails created`);
    
    res.status(200).send({ 
      message: 'Files uploaded successfully.', 
      files: req.files,
      thumbnails: results 
    });
  } catch (error) {
    console.error('[UPLOAD] Fatal error:', error);
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




