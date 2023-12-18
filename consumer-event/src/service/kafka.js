const { Kafka } = require('kafkajs')

const clientId = 'movie-event';

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: clientId })

const consumeMovieStream = async (handler) => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'movies', fromBeginning: false })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('received message')
      try {
        await handler(JSON.parse(message.value.toString()))
      } catch (e) {
        console.error('unable to handle incoming message', e)
      }
    },
  })
}

module.exports = consumeMovieStream