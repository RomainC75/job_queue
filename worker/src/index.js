const amqp = require('amqplib/callback_api');

const {getYtvideo} = require('./utils/getYtvideo')

const RABBIT_HOSTNAME=process.env.RABBIT_HOSTNAME;
const RABBIT_USERNAME=process.env.RABBIT_USERNAME;
const RABBIT_PASSWORD=process.env.RABBIT_PASSWORD;

const FULL_URL = `amqp://${RABBIT_USERNAME}:${RABBIT_PASSWORD}@${RABBIT_HOSTNAME}`;

// getYtvideo('mlkj', 'https://www.youtube.com/watch?v=RIxlGbqc2RY');

amqp.connect(FULL_URL, function(error0, connection) {
    if (error0) {
        console.log("=> error0", error0)
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            console.log("=> error1", error1)
            throw error1;
        }
        var queue = 'ytDownload';
        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1)

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async function(msg) {
            console.log(" [x] Received %s", msg.content.toString() );
            if(Math.random()<0.5){
                try {
                    console.log( "==> content : ", JSON.parse(msg.content.toString()) );
                    const {url, id} = JSON.parse( msg.content.toString() );
                    await getYtvideo(id, url, "channel");

                    console.log("==> DONE !!!!!!!!!!!", ans);
                    channel.ack(msg);
                } catch (error) {
                    console.log("==> error :::: ", error);
                    channel.reject(msg, true);
                }
            }else{
                console.log(" xx REJECTED xx : ", msg.content.toString())
                channel.reject(msg, true)
            }
        }, {
            noAck: false
        });
    });
}) 