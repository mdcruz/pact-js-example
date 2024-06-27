const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const movieEventHandler = require("./movie.handler");
const { like } = MatchersV3;
const path = require("path");

describe("Kafka handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "ConsumerEvent",
    provider: "EventProducer",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  describe("receive a add movie event", () => {
    it("accepts a movie event", () => {
      return messagePact
        .expectsToReceive("a movie add event")
        .withContent({
          name: like("The World's End"),
          year: like("2013"),
        })
        .withMetadata({
          contentType: "application/json",
          topic: "movies",
        })
        .verify(asynchronousBodyHandler(movieEventHandler));
    });
  });
});
