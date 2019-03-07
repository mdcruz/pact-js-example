const { Verifier } = require('@pact-foundation/pact');

describe('Pact Verification', () => {
  it('should validate the expectations of our consumer', () => {
    const opts = {
      provider: 'Provider',
      providerBaseUrl: 'http://localhost:3000',
      pactBrokerUrl: process.env.PACT_URL,
      tags: ['test'],
      pactBrokerUsername: process.env.PACT_USERNAME,
      pactBrokerPassword: process.env.PACT_PASSWORD,
      publishVerificationResult: true,
      providerVersion: '1.0.0',
      logLevel: 'DEBUG',
    };

    return new Verifier(opts).verifyProvider().then(output => {
      console.log('Pact Verification Complete!')
      console.log(output);
    });
  });
});
