import ampq, { Channel, Connection } from "amqplib"
import os from "os"

async function receiveMail(){
    let channel:any;
    try {
        const connection :Connection = await ampq.connect("amqp://localhost")

        const channel = await connection.createChannel();
        const exchange="mail_exchange"
        const exchangeType = "topic"

        await channel.assertExchange(exchange,"topic",{durable:false})

        await channel.assertQueue("order_queue",{durable:false})
        await channel.bindQueue("order_queue",exchange,"order.*")

        await channel.assertQueue("payment_queue",{durable:false})
        await channel.bindQueue("payment_queue",exchange,"payment.*")


        channel.consume("order_queue",(message:any)=>{
            console.log(`The Order Data is Received:`)
            console.log(JSON.parse(message.content))
        })

        
        channel.consume("payment_queue",(message:any)=>{
            console.log(`The Payment Data is Received:`)
            console.log(JSON.parse(message.content))
        })


    } catch (error:any) {
        channel.nack(error)
      console.log(error)
    }

}
receiveMail()
