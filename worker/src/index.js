const amqp = require('amqplib/callback_api');
const { createInvoice } = require('./pdfCreator')
const { sendFileToServer } = require('./sendFile');
const { getContainerNumber, getOvpnFilename } = require('./utils/getContainerName');
const connectToSurfsharkVPN = require('./utils/vpn');
// const { v4: uuidv4 } = require('uuid')

const RABBIT_HOSTNAME=process.env.RABBIT_HOSTNAME;
const RABBIT_USERNAME=process.env.RABBIT_USERNAME;
const RABBIT_PASSWORD=process.env.RABBIT_PASSWORD;

const FULL_URL = `amqp://${RABBIT_USERNAME}:${RABBIT_PASSWORD}@${RABBIT_HOSTNAME}`;


const launch = async () =>{
    const CONTAINER_NAME = await getContainerNumber()
    console.log( "=> PROCESS ID ", CONTAINER_NAME )

    const fileNames = await getOvpnFilename()
    console.log("=> filenames : ", fileNames)
    
    await connectToSurfsharkVPN()
    await new Promise((resolve)=>setTimeout(()=>{resolve()},2000))

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
            var queue = 'pokemon';
            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1)
    
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
            channel.consume(queue, async function(msg) {
                console.log(" [x] Received %s", msg.content.toString() );
                if(Math.random()<0.5){
                    try {
                        console.log( "==> content : ", JSON.parse(msg.content.toString()) )
                        const {name, id} = JSON.parse( msg.content.toString() )
                        console.log( " xx DONE xx : ", name )
                        const infos = await getPokemonInfos(name)
                        // console.log("invoice done")
                        await new Promise((resolve)=>setTimeout(()=>{resolve()},10000))
                        const ans = await sendFileToServer( id )
                        console.log("==> DONE !!!!!!!!!!!", ans)
                        channel.ack(msg)
                    } catch (error) {
                        console.log("==> error :::: ", error)
                        channel.reject(msg, true)
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
}

launch()