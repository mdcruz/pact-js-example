# PactJS Contract Testing Example

An example test framework using Pact-js to validate contract testing between consumer and provider. The application that we are testing is a simple movies API which returns a list of movies.

## Running the Movies API locally

Install dependencies
`npm i`

Run the movies API
`npm run start:provider`

## Running the tests

I am using [Pactflow](https://pactflow.io/) as my broker. To use Pactflow , register for their free developer plan and export your Pactflow Broker URL and API token:

```
export PACT_BROKER_URL=<PACT_BROKER_URL here>
export PACT_API_TOKEN=<API_TOKEN here>
```

Run the consumer tests:
`npm run test:consumer`

Publish the contract to your pact broker:
`npm run publish:pact`

Run the provider tests
`npm run test:provider`
