const { Verifier } = require('@pact-foundation/pact');
const pactBrokerUrl = process.env.PACT_BROKER_URL;
const providerBaseUrl =
  process.env.PROVIDER_BASE_URL || 'http://localhost:3000/';
const pactBrokerToken = process.env.PACT_BROKER_TOKEN;

const options = {
  provider: 'movie-provider',
  providerBaseUrl,
  pactBrokerUrl,
  pactBrokerToken,
  providerVersion: '1.0.0',
  publishVerificationResult: true,
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of movie-consumer', () => {
    return verifier.verifyProvider();
  });
});
