# Dependency and Pact Updates

Updated 2026-11-04.

## Dependencies

- Updated the root JavaScript dependencies and lockfile to current releases. GraphQL is pinned to 16.14.2, the latest version compatible with the selected Apollo REST datasource.
- Added `@pact-foundation/pact-cli` 18.10.9 for Pact Broker and Pactflow commands. Updated package scripts to use `pact broker` and `pact pactflow` instead of deprecated executable aliases.
- Android/Gradle dependencies were intentionally left unchanged.

## Previous Commit: `5c54052`

The dependency commit updated these root packages:

- Apollo Client 3.8.8 to 4.3.6; Apollo Server 4.9.5 to 5.5.1; Apollo REST datasource 6.2.2 to 6.4.1.
- Pact JS 12.1.0 to 17.1.4; Pact Cypress adapter 1.3.0 to 2.0.0.
- Cypress 13.7.3 to 16.2.1; Jest 29.7.0 to 30.5.2; Supertest 6.3.4 to 7.3.1.
- Axios 1.5.1 to 1.21.0; CORS 2.8.5 to 2.8.6; Express 4.18.2 to 5.3.0; GraphQL 16.8.1 to 16.14.2; GraphQL Tag 2.12.6 to 2.12.7; Joi 17.10.2 to 18.3.1; React 18.2.0 to 19.3.1; Swagger JSDoc 6.2.8 to 6.3.0; Swagger UI Express 5.0.0 to 5.0.1; UUID 9.0.1 to 14.0.3.
- Cross-env 7.0.3 to 10.1.0 and Newman 6.1.2 to 6.2.3.

That commit also migrated the GraphQL consumer Pact test, corrected provider state setup and missing-movie integration assertions, and regenerated the Web and GraphQL Pact files.

## Compatibility Changes

- Migrated the GraphQL consumer contract test to Pact V3 APIs and Apollo Client 4 request matching. Tests use the mock server's assigned URL.
- Corrected provider-state setup to insert the nested movie fixture and updated missing-movie integration assertions to expect the API's JSON error response.
- Regenerated the Web and GraphQL Pact files with the upgraded Pact library.

## Verification

Passed local checks: npm dependency installation; web consumer contract (6 tests); GraphQL consumer and provider contracts (2 interactions each); Movies API provider contract and integration tests (5 integration tests); event consumer and producer contracts; and Cypress (1 test).

Pact Broker/Pactflow command entry points and options were checked with CLI help. Publishing/deployment was not run against a broker. The Dredd publish npm lifecycle hook also needs a running API and an existing `output/` directory. Pact 17 requires Node 22 or newer; verification used Node 24. Package scripts retain POSIX-style environment expansion, so on Windows they require a POSIX-compatible shell such as Git Bash.

Android/Gradle build and tests were not run; that project was out of scope for this update.
