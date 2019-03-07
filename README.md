# Pact-js-example
An example test framework using PactJS to validate contract testing between consumer and provider.

# Running the tests
Install dependencies

```
npm i
```

export your Pact broker details:

```
export PACT_URL=
export PACT_USERNAME=
export PACT_PASSWORD=
```

Run the consumer tests:

```
npm run test:consumer
```

Publish the contract to your pact broker

```
publish-pact
```

Start the actual provider

```
node provider/providerService.js
```

Run the provider tests

```
npm run test:provider
```
