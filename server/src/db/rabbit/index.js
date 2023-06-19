const amqp = require('amqplib/callback_api');

const HOSTNAME = process.env.RABBIT_HOSTNAME
const RABBIT_USERNAME = process.env.RABBIT_USERNAME
const RABBIT_PASSWORD = process.env.RABBIT_PASSWORD

console.log("==> rabbitmq name : ", HOSTNAME)

let ch=null

amqp.connect(`amqp://${RABBIT_USERNAME}:${RABBIT_PASSWORD}@${HOSTNAME}`, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

module.exports = {
    ch,
    amqp
}