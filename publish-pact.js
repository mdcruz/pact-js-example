require('dotenv').config();
const shell = require('shelljs');

const command = `pact-broker publish ./pacts --consumer-app-version=1.0.3 --tag=main --broker-base-url=${process.env.PACT_BROKER_BASE_URL} --broker-token=${process.env.PACT_BROKER_TOKEN}`;

shell.exec(command);