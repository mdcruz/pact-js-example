const path = require('path');
const { fetchMovies, fetchSingleMovie } = require('./consumer');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const {
  integer,
  like,
  string
} = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'WebConsumer',
  provider: 'MoviesAPI',
});

describe('Migrate integration tests', () => {
  describe('When a GET request is made to /movies', () => {
    test('it should return an empty list', async () => {
      provider
        .uponReceiving('get movies when none exist in database')
        .withRequest({
          method: 'GET',
          path: '/movies',
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: like([]),
        });

      await provider.executeTest(async mockProvider => {
        const movies = await fetchMovies(mockProvider.url);
        expect(movies).toEqual([]);
      });
    });
  });

  describe('When a GET request is made to /movie/:id', () => {
    test('it should return a movie object', async () => {
      provider
        .uponReceiving('get movie by id 1')
        .withRequest({
          method: 'GET',
          path: '/movie/1',
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            id: integer(1),
            name: string("Barbie"),
            year: integer(2023)
          },
        });

      await provider.executeTest(async mockProvider => {
        const movie = await fetchSingleMovie(mockProvider.url, 1);
        expect(movie).not.toBeNull();
      });
    });
  });
});