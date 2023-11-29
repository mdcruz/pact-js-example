const axios = require('axios');

const fetchMovies = async (url) => {
  const response = await axios
    .get(`${url}/movies`)
    .then((res) => res.data)
    .catch((err) => err.response);
  return response;
};

const fetchSingleMovie = async (url, id) => {
  const response = await axios
    .get(`${url}/movie/${id}`)
    .then((res) => res.data)
    .catch((err) => err.response);
  return response;
};

const addNewMovie = async (url, movieName, movieYear) => {
  const data = {
    name: movieName,
    year: movieYear,
  };
  const response = await axios
    .post(`${url}/movies`, data)
    .then((res) => res.data)
    .catch((err) => err.response.data.message);
  return response;
};

const deleteMovie = async (url, id) => {
  const response = await axios
    .delete(`${url}/movie/${id}`)
    .then((res) => res.data.message)
    .cath((err) => err.response.data.message);
  return response;
};

module.exports = {
  fetchMovies,
  fetchSingleMovie,
  addNewMovie,
  deleteMovie,
};
