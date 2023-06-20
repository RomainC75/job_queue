const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {publishToQueue} = require('./services/rabbit.service')
const multer = require('multer')

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

app.post('/upload/:id', upload.single('file'), (req, res) => {
    console.log("=>", req.params.id, req.headers)
    res.status(201).send('File uploaded successfully.');
  });

app.post("/url",async (req,res)=>{
    publishToQueue('main',req.body.name)
    res.status(200).json({
        message : 'done'
    })
})

app.listen(PORT, ()=>{
    console.log("=> server listening at port", PORT)
})