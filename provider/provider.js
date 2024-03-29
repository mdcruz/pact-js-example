const express = require('express');
const Movies = require('./movies');
const Joi = require('joi');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

/**
 * @openapi
 * /movies:
 *  get:
 *    description: Get all movies
 *    responses:
 *      '200':
 *        description: A list of movie objects
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  name:
 *                    type: string
 *                  year:
 *                    type: integer
 *                example:
 *                  id: 1
 *                  name: James Bond
 *                  year: 2021
 */
server.get('/movies', (req, res) => {
  res.send(movies.getMovies());
});

/**
 * @openapi
 * /movie/{id}:
 *  get:
 *    description: Get a movie by Id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: A movie object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *                year:
 *                  type: integer
 *              example:
 *                id: 1
 *                name: James Bond
 *                year: 2021
 *      '404':
 *        description: No movie exists
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *              example: Movie not found
 */
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

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Provider Movies API"
    },
    externalDocs: {
      description: "swagger.json",
      url: "/swagger.json"
    }
  },
  apis: ["./provider/provider.js"]
};

const specs = swaggerJsdoc(options);

server.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
server.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

module.exports = {
  server,
  importData,
  movies,
};
