require('dotenv').config();
const {
  MessageProviderPact,
  providerWithMetadata,
} = require("@pact-foundation/pact");
const { createMovie } = require("./movie.event");

describe("Event producer tests", () => {
  const provider = new MessageProviderPact({
    messageProviders: {
      "a movie add event": providerWithMetadata(
        () => createMovie("The World's End", "2013"),
        {
          topic: "movies",
          contentType: "application/json",
        }
      ),
    },
    logLevel: "info",
    provider: "EventProducer",
    providerVersion: process.env.GITHUB_SHA,
    providerVersionBranch: process.env.GITHUB_BRANCH,
    consumerVersionSelectors: [
      { mainBranch: true },
      { matchingBranch: true },
      { deployedOrReleased: true },
    ],
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    pactUrls: [process.env.PACT_BROKER_BASE_URL],
    publishVerificationResult: true,
  });

  describe("send a movie add event", () => {
    it("sends a valid movie", () => {
      return provider.verify();
    });
  });
});
