const { expect } = require('chai');
const { Pact } = require('@pact-foundation/pact');
const {
  somethingLike: like,
  eachLike,
} = require('@pact-foundation/pact').Matchers;
const { fetchMovies, fetchSingleMovie } = require('./consumer');
const path = require('path');

const PORT = 4000;
const URL = 'http://localhost';

const endpoint = {
  URL,
  PORT,
};

const provider = new Pact({
  consumer: 'Consumer',
  provider: 'Provider',
  port: PORT,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
});

const movieExpectation = eachLike(
  {
    id: 1,
    name: like('Movie 1'),
    year: like(1999),
  },
  {
    min: 5,
  }
);

describe('Given the Pact mock server has been setup', () => {
  before(() => provider.setup());

  describe('and a request to list all movies is made', () => {
    before(() =>
      provider.addInteraction({
        state: 'i have a list of movies',
        uponReceiving: 'a request to list all movies',
        withRequest: {
          method: 'GET',
          path: '/movies',
        },
        willRespondWith: {
          status: 200,
          body: movieExpectation,
        },
      })
    );

    it('should return the correct data', async () => {
      const response = await fetchMovies(endpoint);
      expect(response[0].name).to.equal('Movie 1');
      expect(response[0].year).to.equal(1999);
    });
  });

  describe('and a request to a single movie that exist is made', () => {
    before(() =>
      provider.addInteraction({
        state: 'i have a list of movies',
        uponReceiving: 'a request to get a movie that exist',
        withRequest: {
          method: 'GET',
          path: '/movie/2',
        },
        willRespondWith: {
          status: 200,
        },
      })
    );

    it('should return 200 status code', async () => {
      const response = await fetchSingleMovie(endpoint, 2);
      expect(response.status).to.equal(200);
    });
  });

  describe('and a request to a single movie that does not exist is made', () => {
    before(() =>
      provider.addInteraction({
        state: 'i have a list of movies',
        uponReceiving: 'a request to get a movie that does not exist',
        withRequest: {
          method: 'GET',
          path: '/movie/100',
        },
        willRespondWith: {
          status: 404,
        },
      })
    );

    it('should return 404 status code', async () => {
      const response = await fetchSingleMovie(endpoint, 100);
      expect(response.status).to.equal(404);
    });
  });

  after(() => provider.finalize());
  afterEach(() => provider.verify());
});
