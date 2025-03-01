// Headers-Exchange
import amqp from 'amqplib';
async function send(headers: any, message: string) {
  try {
    const connection = await amqp.connect("amqp://localhost")
    const channel = await connection.createChannel();
    const exchangeName = "youtube_exchange"
    const exchangeType = "headers"
    await channel.assertExchange(exchangeName, exchangeType, {
      durable: false
    })
    channel.publish(exchangeName,"",Buffer.from(message as string),{
      persistent:false,
      headers
    })
  console.log("Sent Data")
  } catch (error) {
    console.log(error)
  }
}

send({
  "x-match":"any",
  "youtube-type":"video",
  "old-or-new":"new"
},"Uploaded A New Video")