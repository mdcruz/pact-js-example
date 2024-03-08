const path = require('path');
const { getMovies, getMovieById } = require('./graphql-client.js')
const { Pact, GraphQLInteraction, Matchers } = require('@pact-foundation/pact');

const {
  eachLike,
  integer,
  string,
} = Matchers;

const provider = new Pact({
  port: 4000,
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'GraphQLConsumer',
  provider: 'GraphQLProvider',
});

const EXPECTED_BODY = { id: 1, name: "My GraphQL movie", year: 1999 };

describe('GraphQL example', () => {
  // Setup the provider
  beforeAll(() => provider.setup());

  // Generate contract when all tests done
  afterAll(() => provider.finalize());

  // Verify the consumer expectations
  afterEach(() => provider.verify());

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
    })

    test('returns the correct response', async () => {
      const response = await getMovies();
      expect(response.movies[0]).toEqual(EXPECTED_BODY);
    });
  });

  describe('When a query to list a single movie on /graphql is made', () => {
    beforeAll(() => {
      const graphqlQuery = new GraphQLInteraction()
        .uponReceiving('a single movie request')
        .withQuery(
          `
          query MovieQuery($movieId: Int!) {
            movie(movieId: $movieId) {
              id
              name
              year
            }
          }
        `
        )
        .withOperation('MovieQuery')
        .withVariables({ movieId: 1 })
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
              movie: {
                id: integer(EXPECTED_BODY.id),
                name: string(EXPECTED_BODY.name),
                year: integer(EXPECTED_BODY.year)
              },
            },
          },
        });
      return provider.addInteraction(graphqlQuery);
    })

    test('returns the correct response', async () => {
      const response = await getMovieById(1);
      expect(response.movie).toEqual(EXPECTED_BODY);
    });
  });
});