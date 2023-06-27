const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {publishToQueue} = require('./services/rabbit.service')
const multer = require('multer')
const Invoice = require('./models/invoice')
const Pokemon = require('./models/Pokemon')
require('./db/mongo') 

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const storage = multer.diskStorage({
    // destination: 'uploads/',
    destination: (req, file, callback) => {
      callback(null, 'uploads');
    },
    filename: (req, file, cb) => {
      console.log("==> file received : ", req.params.id+'-'+file.originalname)
      cb(null, req.params.id+'-'+file.originalname);
    }
  });
const upload = multer({ storage });

app.post('/upload/:id', upload.single('file'), async(req, res, next) => {
  try {
    const ans= await Invoice.findByIdAndUpdate(req.params.id, {
      isDone: true,
    }, {new: true})
    console.log("=>", req.params.id, req.headers, ans)
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    next(error)
  }
  });

app.post("/url",async (req, res, next)=>{
  try {
    const ans = await Invoice.create({name:req.body.name})
    publishToQueue('main', req.body.name, ans._id.toString())
    res.status(200).json({
        message : 'done'
    })
  } catch (error) {
    console.log("=> error ")
    next(error)
  }
})

app.get("/pokemon/:name", async (req, res, next)=>{
  try {
    const name = req.params.name
    const foundPokemon = await Pokemon.find({name})
    if(foundPokemon){
      return res.status(200).json(foundPokemon)
    }
    const ans = await Pokemon.create({name})
    publishToQueue('pokemon', name, ans._id.toString())
    console.log("=> name : ", req.params.name)
    res.status(200).json({
      message: 'done'
    })
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next)=>{
  console.log("==> server ERROR", err)
  res.status(400).json(err)
})

app.listen(PORT, ()=>{
    console.log("=> server listening at port", PORT)
})