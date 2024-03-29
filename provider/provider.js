const Joi = require('joi');
const express = require('express');
const Movies = require('./movies')

const server = express();
server.use(express.json());

const movies = new Movies();

// Load default data into the Movies class
const importData = () => {
  const data = require('.././data/movies.json');
  data.reduce((a, v) => {
    v.id = a + 1;
    movies.insertMovie(v);
    return a + 1;
  }, 0);
};

server.get('/movies', (req, res) => {
  res.send(movies.getMovies());
});

server.get('/movie/:id', (req, res) => {
  const movie = movies.getMovieById(req.params.id);
  if (!movie) {
    res.status(404).send({ error: 'Movie not found' });
  } else {
    res.send(movie);
  }
});

server.post('/movies', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2023).required(),
  });

  const result = schema.validate(req.body);
  const id = movies.length < 1 ? (movies[movies.length - 1].id) + 1 : 1;

  const movie = {
    id,
    name: req.body.name,
    year: req.body.year,
  };

  if (result.error) res.status(404).send(result.error.details[0]);

  if (movies.getMovieByName(req.body.name)) {
    res.status(409).send({ error: `Movie ${req.body.name} already exists` });
  } else {
    movies.insertMovie(movie);
    res.json(movie);
  }
});

server.delete('/movie/:id', (req, res) => {
  const movie = movies.getMovieById(req.params.id);
  if (!movie) {
    res.status(404).send({ error: `Movie ${req.params.id} not found` });
  } else {
    movies.getMovies().filter(movie => movie.id !== req.params.id)
    res.send({ message: `Movie ${req.params.id} has been deleted` });
  }
});

module.exports = {
  server,
  importData,
  movies,
};
