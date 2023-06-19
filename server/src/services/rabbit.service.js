const {ch} = require('../db/rabbit/index')

const publishToQueue = async (queueName, data) =>{
    ch.sendToQueue(queueName, new Buffer(data))
}


module.exports = {
    publishToQueue
}