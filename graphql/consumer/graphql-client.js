const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { gql } = require('graphql-tag');
const { createHttpLink } = require('apollo-link-http');

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: createHttpLink({
    fetch: require('node-fetch'),
    uri: 'http://127.0.0.1:4000/graphql',
  }),
});

const getMovies = async () => {
  const response = await client
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
    .then((result) => result.data)
    .catch((err) => err.response);

  return response;
};

module.exports = {
  getMovies
};