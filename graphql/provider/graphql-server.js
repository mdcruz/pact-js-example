const { ApolloServer, gql } = require('apollo-server');
const MovieAPI = require('./data-source.js');

const typeDefs = gql`

  type Movie {
    id: Int
    name: String
    year: Int
  }

  type Query {
    movie(movieId: String!): Movie
    movies: [Movie]
  }
`;

const resolvers = {
  Query: {
    movies: (root, args, { dataSources }) => {
      return dataSources.movieApi.getMovies();
    },
    movie: (root, { movieId }, { dataSources }) => {
      return dataSources.movieApi.getMovieById(movieId);
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    movieApi: new MovieAPI()
  })
});

const port = process.env.port || 9000;

server.listen(port).then(() => {
  console.log(`server running 🚀 http://localhost:${port}/graphql`)
});

module.exports = {
  resolvers
}