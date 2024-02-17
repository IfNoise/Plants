const express=require("express")
const https = require('https');
const fs = require('fs');
const config=require("config")
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cors=require("cors")
const path=require('path')

const PORT=config.get("port")||5000

const app=express()
let options
if(process.env.NODE_ENV==='development'){
options = {

  key: fs.readFileSync(__dirname + '/ssl/homeserver.key', 'utf8'),
 cert: fs.readFileSync(__dirname + '/ssl/homeserver.crt', 'utf8')
};}else{
  options = {

    key: fs.readFileSync(__dirname + '/ssl/labserver.key', 'utf8'),
   cert: fs.readFileSync(__dirname + '/ssl/labserver.crt', 'utf8')
}}
const server=https.createServer(options,app)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({extended:true}))
app.use('/api/auth',require('./routes/auth.routes.js'))
app.use('/api/tray',require('./routes/tray.routes.js'))
app.use('/api/plant',require('./routes/plant.routes.js'))
app.use('/api/strain',require('./routes/strain.routes.js'))
app.use('/api/cycle',require('./routes/cycle.routes.js'))
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
    server.listen(PORT,()=>console.log(`Server has been started at ${PORT}`)
    )
  } catch (error) {
    console.log('SErver error',error.message)
    process.exit(1)
  }
}

start()




