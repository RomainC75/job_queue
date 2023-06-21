const mongoose = require("mongoose");

const MONGO_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`

console.log('MONGODB_URI : ',MONGO_URI)

mongoose
  .connect(MONGO_URI)
  .then( (x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch( (err) => {
    console.error("Error connecting to mongo: ", err);
  });


  