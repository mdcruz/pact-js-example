const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');

const MovieAPI = require('./data-source.js');

const typeDefs = gql`
  type Movie {
    id: Int
    name: String
    year: Int
  }

  type Query {
    movie(movieId: Int!): Movie
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

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        dataSources: {
          movieApi: new MovieAPI()
        }
      }
    }
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
}

startServer();