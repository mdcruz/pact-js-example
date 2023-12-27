const {
    MessageProviderPact,
    providerWithMetadata,
  } = require('@pact-foundation/pact');
  const { createMovie } = require('./movie.event');
  const path = require("path");
  
  describe('Event producer tests', () => {
    const provider = new MessageProviderPact({
      messageProviders: {
        'a movie add event': providerWithMetadata(() => createMovie("The World's End", "2013"), {
            kafka_topic: 'movies'
        }),
      },
      logLevel: 'info',
      provider: 'EventProducer',
      providerVersion: '1.0.0',
      pactBrokerUrl: 'https://mariecruz.pactflow.io/',
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      providerVersionBranch: 'main',
    });
  
    describe('send a movie add event', () => {
      it('sends a valid movie', () => {
        return provider.verify();
      });
    });
  });