const path = require('path');
const { getMovies, getMovieById } = require('./graphql-client.js')
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');

const {
  eachLike,
  integer,
  like,
  regex,
  string,
} = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'GraphQLConsumer',
  provider: 'GraphQLProvider',
});

const EXPECTED_BODY = { id: 1, name: "My GraphQL movie", year: 1999 };

describe('GraphQL example', () => {
  describe('When a query to list all movies on /graphql is made', () => {
    test('returns the correct response', async () => {
      await provider
        .uponReceiving('a movies request')
        .withRequest({
          method: 'POST',
          path: '/graphql',
          body: like({
            extensions: {
              clientLibrary: {
                name: string('@apollo/client'),
                version: string('4.3.6'),
              },
            },
            operationName: 'MoviesQuery',
            query: regex(
              '\\s*query\\s*MoviesQuery\\s*\\{\\s*movies\\s*\\{\\s*id\\s*name\\s*year(?:\\s+__typename)?\\s*\\}\\s*\\}\\s*',
              'query MoviesQuery { movies { id name year __typename } }'
            ),
            variables: like({}),
          }),
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
        })
        .executeTest(async mockProvider => {
          const response = await getMovies(`${mockProvider.url}/graphql`);
          expect(response.movies[0]).toEqual(EXPECTED_BODY);
        });
    });
  });

  describe('When a query to list a single movie on /graphql is made', () => {
    test('returns the correct response', async () => {
      await provider
        .uponReceiving('a single movie request')
        .withRequest({
          method: 'POST',
          path: '/graphql',
          body: like({
            extensions: {
              clientLibrary: {
                name: string('@apollo/client'),
                version: string('4.3.6'),
              },
            },
            operationName: 'MovieQuery',
            query: regex(
              '\\s*query\\s*MovieQuery\\(\\$movieId:\\s*Int!\\)\\s*\\{\\s*movie\\(movieId:\\s*\\$movieId\\)\\s*\\{\\s*id\\s*name\\s*year(?:\\s+__typename)?\\s*\\}\\s*\\}\\s*',
              'query MovieQuery($movieId: Int!) { movie(movieId: $movieId) { id name year __typename } }'
            ),
            variables: like({ movieId: 1 }),
          }),
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
        })
        .executeTest(async mockProvider => {
          const response = await getMovieById(1, `${mockProvider.url}/graphql`);
          expect(response.movie).toEqual(EXPECTED_BODY);
        });
    });
  });
});