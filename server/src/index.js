const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {publishToQueue} = require('./services/rabbit.service')

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/url",async (req,res)=>{
    console.log("=> body : ", req.body)
})

app.listen(PORT, ()=>{
    console.log("=> server listening at port", PORT)
})