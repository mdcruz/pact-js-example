class Movie {
  constructor() {
    this.movies = [];
  }

  getMovies() {
    return this.movies;
  }

  getMovieById(id) {
    return this.movies.find((movie) => parseInt(id) == movie.id);
  }

  getMovieByName(name) {
    return this.movies.find(movie => movie.name === name)
  }

  insertMovie(movie) {
    this.movies.push(movie);
  }

  clear() {
    this.movies = [];
  }

  getFirstMovie() {
    return this.movies[0];
  }

  getMoviesCount() {
    return this.movies.length;
  }
}

module.exports = Movie;