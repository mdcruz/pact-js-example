# Pact-js-example

An example test framework using PactJS to validate contract testing between consumer and provider.

# Running the tests

Install dependencies

```
npm i
```

I am using Pactflow as my broker. To use Pactflow, register for their free developer plan and export your Pactflow API token:

```
export PACT_API_TOKEN=<API_TOKEN here>
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
