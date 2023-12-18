const repository = require("./movie.repository");
const Movie = require('./movie');

const handler = (movie) => {
  return Promise.resolve(repository.insert(new Movie(movie.name, movie.year)))
}

module.exports = handler