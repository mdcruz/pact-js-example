const pact = require('@pact-foundation/pact-node');
const path = require('path');

pact.publishPacts({
  pactFilesOrDirs: [
    path.resolve(__dirname, '../pact/pacts/'),
  ],
  pactBroker: process.env.PACT_URL,
  pactBrokerUsername: process.env.PACT_USERNAME,
  pactBrokerPassword: process.env.PACT_PASSWORD,
  tags: ['test'],
  consumerVersion: '1.0.0'
}).then(() => {
  console.log(`Pact contract successfully published. Head over to ${process.env.PACT_URL}`);
}).catch(err => {
  console.log('Pact contract not published: ', err);
});
