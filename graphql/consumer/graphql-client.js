const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');

const createClient = (uri) => new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: new HttpLink({
    fetch: require('node-fetch'),
    uri,
  }),
});

const client = createClient('http://127.0.0.1:4000/graphql');

const getMovies = async (uri) => {
  const response = await (uri ? createClient(uri) : client)
    .query({
      query: gql`
        query MoviesQuery {
          movies {
            id
            name
            year
          }
        }
      `,
    })
    .then((result) => result.data);

  return response;
};

const getMovieById = async (movieId, uri) => {
  const response = await (uri ? createClient(uri) : client)
    .query({
      query: gql`
        query MovieQuery($movieId: Int!) {
          movie(movieId: $movieId) {
            id
            name
            year
          },
        }
      `,
      variables: {
        movieId,
      },
    })
    .then((result) => result.data);

  return response;
};

module.exports = {
  getMovies,
  getMovieById,
};