const path = require('path');
const { addNewMovie, deleteMovie, fetchMovies, fetchSingleMovie } = require('./consumer');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');

const {
  eachLike,
  integer,
  string,
} = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'WebConsumer',
  provider: 'MoviesAPI',
});

const EXPECTED_BODY = { id: 1, name: "My movie", year: 1999 };

describe('Movies Service', () => {
  describe('When a GET request is made to /movies', () => {
    test('it should return all movies', async () => {
      provider
        .uponReceiving('a request to all movies')
        .withRequest({
          method: 'GET',
          path: '/movies',
        })
        .willRespondWith({
          status: 200,
          body: eachLike(EXPECTED_BODY),
        });

      await provider.executeTest(async mockProvider => {
        const movies = await fetchMovies(mockProvider.url);
        expect(movies[0]).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a GET request is made to a specific movie ID', () => {
    test('it should return a specific movie', async () => {
      const testId = 100;
      EXPECTED_BODY.id = testId;

      provider
        .given('Has a movie with specific ID', { id: testId })
        .uponReceiving('a request to a specific movie')
        .withRequest({
          method: 'GET',
          path: `/movie/${testId}`,
        })
        .willRespondWith({
          status: 200,
          body: {
            id: integer(testId),
            name: string(EXPECTED_BODY.name),
            year: integer(EXPECTED_BODY.year),
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await fetchSingleMovie(mockProvider.url, testId);
        expect(movies).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a POST request is made to /movies', () => {
    test('it should add a new movie', async () => {

      const name = 'Harry Potter and the Philosopher Stone';
      const year = 2001;

      EXPECTED_BODY.name = name;
      EXPECTED_BODY.year = year;

      provider
        .uponReceiving('a request to add a new movie')
        .withRequest({
          method: 'POST',
          body: {
            name,
            year,
          },
          path: '/movies',
        })
        .willRespondWith({
          status: 200,
          body: {
            id: integer(EXPECTED_BODY.id),
            name,
            year,
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await addNewMovie(mockProvider.url, name, year);
        expect(movies).toEqual(EXPECTED_BODY);
      });
    });

    test('it should not add a movie that exists already', async () => {

      const name = 'Harry Potter and the Philosopher Stone';
      const year = 2001;

      EXPECTED_BODY.name = name;
      EXPECTED_BODY.year = year;

      provider
        .given('an existing movie exists', { EXPECTED_BODY })
        .uponReceiving('a request to add an existing movie')
        .withRequest({
          method: 'POST',
          body: {
            name,
            year,
          },
          path: '/movies',
        })
        .willRespondWith({
          status: 409,
          body: {
            error: string(`Movie ${name} already exists`)
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await addNewMovie(mockProvider.url, name, year);
        expect(movies.error).toEqual(`Movie ${name} already exists`);
      });
    });
  });

  describe('When a DELETE request is made to /movies', () => {
    test('it should throw an error if movie to delete does not exist', async () => {
      const testId = 643256;

      provider
        .uponReceiving('a request to delete a movie that does not exists')
        .withRequest({
          method: 'DELETE',
          path: `/movie/${testId}`,
        })
        .willRespondWith({
          status: 404,
          body: {
            error: string(`Movie ${testId} not found`)
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await deleteMovie(mockProvider.url, testId);
        expect(movies.error).toEqual(`Movie ${testId} not found`);
      });
    });

    test('it should delete an existing movie successfully', async () => {
      const testId = 100;
      EXPECTED_BODY.id = testId;

      provider
        .given('there is a movie with specific ID', { id: testId })
        .uponReceiving('a request to delete a movie that exists')
        .withRequest({
          method: 'DELETE',
          path: `/movie/${testId}`,
        })
        .willRespondWith({
          status: 200,
          body: {
            message: string(`Movie ${testId} has been deleted`)
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await deleteMovie(mockProvider.url, testId);
        expect(movies.message).toEqual(`Movie ${testId} has been deleted`);
      });
    });
  });
});