const express=require("express")
const multer  = require('multer')
const config=require("config")
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cors=require("cors")
const path=require('path')

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
  res.status(200).send({ message: 'Files uploaded successfully.', files: req.files });
});

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client-vite', 'dist')))
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
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




