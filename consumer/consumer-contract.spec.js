const { Pact } = require('@pact-foundation/pact');
const { like, eachLike } = require('@pact-foundation/pact').Matchers;
const { fetchMovies } = require('./consumer');
const path = require('path');
const port = 4000;
const provider = new Pact({
  consumer: 'movie-consumer',
  provider: 'movie-provider',
  port,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
});
describe('Movies Service', () => {
  describe('When a request to list all movies is made', () => {
    beforeAll(() =>
      provider.setup().then(() => {
        provider.addInteraction({
          uponReceiving: 'a request to list all movies',
          withRequest: {
            method: 'GET',
            path: '/movies',
          },
          willRespondWith: {
            status: 200,
            // body: [
            //   {
            //     "id": 1,
            //     "name": "The Shawshank Redemption",
            //     "year": 1994
            //   },
            //   {
            //     "id": 2,
            //     "name": "The Dark Knight",
            //     "year": 2008
            //   },
            //   {
            //     "id": 3,
            //     "name": "Amelie",
            //     "year": 2001
            //   },
            //   {
            //     "id": 4,
            //     "name": "Fight Club",
            //     "year": 1994
            //   },
            //   {
            //     "id": 5,
            //     "name": "The Lion King",
            //     "year": 1994
            //   }
            // ]
            body: eachLike(
              {
                id: 1,
                name: like('Movie 1'),
                year: like(2008),
              },
              { min: 5 }
            ),
          },
        });
      })
    );
    test('should return the correct data', async () => {
      const response = await fetchMovies(provider.mockService.baseUrl);
      expect(response).toMatchSnapshot();
    });
    afterEach(() => provider.verify());
    afterAll(() => provider.finalize());
  });
});
