const { Verifier } = require('@pact-foundation/pact');

const options = {
  provider: 'GraphQLProvider',
  providerBaseUrl: `http://localhost:4000/graphql`,
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersion: '1.0.0',
  publishVerificationResult: true,
  consumerVersionTags: ['main'],
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of GraphQLConsumer', () => {
    return verifier
      .verifyProvider()
      .then(output => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
      });
  });
});
