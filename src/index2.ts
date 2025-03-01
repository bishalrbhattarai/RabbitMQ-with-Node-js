import amqp, { Message } from 'amqplib';
async function receive() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel();
        const exchangeName = "youtube_exchange"
        const exchangeType = "headers"


        await channel.assertExchange(exchangeName, exchangeType, {
            durable: false
        })

        const queue = await channel.assertQueue("", {
            durable: false
        })

        await channel.bindQueue(queue.queue, exchangeName, "", {
                "x-match": "all",
                "youtube-type": "video",
                "old-or-new": "new"
        })

        channel.consume(queue.queue,(message)=>{
            if(message) {
                console.log(message.content.toString())
                channel.ack(message)
            }
            else
            channel.nack("Negative Acknowledgement" as unknown as Message)

        })


    } catch (error) {
        console.log(error)
    }
}

receive()