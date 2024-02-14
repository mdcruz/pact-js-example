const { Verifier } = require('@pact-foundation/pact');
const { importData, movies, server } = require('./provider')

const port = '3001';
const app = server.listen(port, () => console.log(`Listening on port ${port}...`));

importData();

const options = {
  provider: 'MoviesAPI',
  providerBaseUrl: `http://localhost:${port}`,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersion: process.env.GITHUB_SHA,
  providerVersionBranch: process.env.GITHUB_BRANCH,
  publishVerificationResult: true,
  stateHandlers: {
    'Has a movie with specific ID': (parameters) => {
      movies.getFirstMovie().id = parameters.id;
      return Promise.resolve({ description: `Movie with ID ${parameters.id} added!` });
    }
  }
}

if (process.env.PACT_URL) {
  console.log(`Pact payload URL specified: ${process.env.PACT_PAYLOAD_URL}`)
  options.pactUrls = [process.env.PACT_PAYLOAD_URL]
} else {
  console.log(`Using Pact Broker Base URL: ${process.env.PACT_BROKER_BASE_URL}`)
  options.pactBrokerUrl = process.env.PACT_BROKER_BASE_URL,
    options.consumerVersionSelectors = [
      { mainBranch: true },
      { matchingBranch: true },
      { deployedOrReleased: true }
    ]
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of movie-consumer', () => {
    if (process.env.PACT_URL) {

    }
    return verifier
      .verifyProvider()
      .then(output => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
        app.close();
      })
  });
});
