import amqp, { Channel, Connection, Replies } from "amqplib"
import os from "os"

async function sendMail(rountingKey:string,message:any){
    try {
        const connection :Connection = await amqp.connect("amqp://localhost")

        const channel = await connection.createChannel();
        const exchange="mail_exchange"
        const exchangeType = "topic"
       await channel.assertExchange(exchange,exchangeType,{durable:false})
      

        channel.publish(exchange,rountingKey,Buffer.from(JSON.stringify(message)))


          console.log(`The Message is Sent:`)
          console.log(message)

    } catch (error:any) {
      console.log(error)
    }

}
sendMail("order.processed",{orderId:1,products:[1,2,3]})
sendMail("payment.processed",{paymentId:1,total:500})
