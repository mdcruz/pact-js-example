const { Kafka } = require("kafkajs")

const clientId = "movie-event"
const brokers = ["localhost:9092"]
const kafka_topic = "movies"

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

const produce = async (name, year) => {
	await producer.connect()
    await producer.send({
        kafka_topic,
        messages: [
            createMovie(name, year),
        ],
    })
}

module.exports = produce