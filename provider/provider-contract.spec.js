const { Verifier } = require('@pact-foundation/pact');

const providerBaseUrl = process.env.PROVIDER_BASE_URL || 'http://localhost:3001/';

const options = {
  provider: 'MoviesAPI',
  providerBaseUrl,
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersion: '1.0.0',
  publishVerificationResult: true,
  consumerVersionTags: ['main']
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of movie-consumer', () => {
    return verifier.verifyProvider();
  });
});
