const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const movieEventHandler = require('./movie.handler')
const { like, regex } = MatchersV3;

const path = require("path");

describe("Kafka handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "ConsumerEvent",
    dir: path.resolve(process.cwd(), "pacts"),
    pactfileWriteMode: "update",
    provider: "MoviesAPI",
    logLevel: "info",
  });

  describe("receive a add movie event", () => {
    it("accepts a movie event", () => {
      return messagePact
        .expectsToReceive("a movie add event")
        .withContent({
          name: like("The World's End"),
          year: like("2013")
        })
        .withMetadata({
          "content-type": "application/json",
          "kafka_topic": "movies",
        })
        .verify(asynchronousBodyHandler(movieEventHandler));
    });
  });
});
