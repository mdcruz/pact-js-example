const { RESTDataSource } = require('@apollo/datasource-rest');

class MovieAPI extends RESTDataSource {
  baseURL = 'http://localhost:3001';

  async getMovies() {
    return this.get('/movies');
  }

  async getMovieById(movieId) {
    return this.get(`/movie/${movieId}`);
  }
};

module.exports = MovieAPI;