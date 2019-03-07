const movies = require('../data/movies.json');

const getMovies = () => {
  return movies;
};

const getMovieById = id => {
  return movies.find(movie => parseInt(id) === movie.id)
};

const getMovieByName = name => {
  return movies.find(movie => movie.name === name)
};

module.exports = {
  getMovies,
  getMovieById,
  getMovieByName,
};