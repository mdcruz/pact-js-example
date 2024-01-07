const { Kafka } = require("kafkajs");
const { createMovie } = require("./movie.event");

const clientId = "movie-event";
const brokers = ["localhost:29092"];

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (name, year) => {
	await producer.connect();
    const message = createMovie(name, year);
    await producer.send({
        topic: "movies",
        messages: [
            {
                key: "1",
                value: JSON.stringify(message),
            }
        ],
    });
}

module.exports = produce;