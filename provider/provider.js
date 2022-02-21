const Joi = require('joi');
const express = require('express');
const { getMovies, getMovieById, getMovieByName } = require('./actions');

const app = express();
app.use(express.json());

const movies = getMovies();

app.get('/movies', (req, res) => {
  res.send(movies);
});

app.get('/movie/:id', (req, res) => {
  const movie = getMovieById(req.params.id);
  if (!movie) {
    res.status(404).send('Movie not found');
  } else {
    res.send(movie);
  }
});

app.post('/movies', (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2022).required(),
  });

  const result = Joi.validate(req.body, schema);
  const movie = {
    id: movies[movies.length - 1].id + 1,
    name: req.body.name,
    year: req.body.year,
  };

  if (result.error) res.status(404).send(result.error.details[0]);

  if (getMovieByName(req.body.name)) {
    res.send(`Movie ${req.body.name} already exists`);
  } else {
    movies.push(movie);
    res.send(movie);
  }
});

app.delete('/movie/:id', (req, res) => {
  const movie = getMovieById(req.params.id);
  if (!movie) {
    res.status(404).send(`Movie ${req.params.id} not found`);
  } else {
    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    res.send(`Movie ${req.params.id} has been deleted`);
  }
});

module.exports = app;
