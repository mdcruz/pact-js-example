const path = require('path');
const util = require('util')
const { getMovies } = require('./graphql-client.js')
const { Pact, GraphQLInteraction, Matchers } = require('@pact-foundation/pact');
const { eachLike } = Matchers;

describe('GraphQL example', () => {
  const provider = new Pact({
    port: 4000,
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'GraphQLConsumer',
    provider: 'GraphQLProvider',
  });

  const EXPECTED_BODY = { id: 1, name: "My GraphQL movie", year: 1999 };

  beforeAll(() => provider.setup())

  describe('When a query to list all movies on /graphql is made', () => {
    beforeAll(() => {
      const graphqlQuery = new GraphQLInteraction()
        .uponReceiving('a movies request')
        .withQuery(
          `
          query MoviesQuery {
            movies {
              id
              name
              year
            }
          }
        `
        )
        .withOperation('MoviesQuery')
        .withVariables({})
        .withRequest({
          method: 'POST',
          path: '/graphql',
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: {
            data: {
              movies: eachLike(EXPECTED_BODY),
            },
          },
        });
      return provider.addInteraction(graphqlQuery);
    });

    it('returns the correct response', async () => {
      const response = await getMovies();
      expect(response.movies[0]).toEqual(EXPECTED_BODY);
    });

    afterEach(() => provider.verify());
    afterAll(() => provider.finalize());
  });
});