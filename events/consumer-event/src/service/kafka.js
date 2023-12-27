const { Kafka } = require('kafkajs');

const clientId = 'movie-event';

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: clientId });

const consumeMovieStream = async (handler) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'movies', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        await handler(JSON.parse(message.value.toString()));
      } catch (e) {
        console.error('unable to handle message', e);
      }
    },
  })
}

module.exports = consumeMovieStream