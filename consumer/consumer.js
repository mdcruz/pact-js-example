const axios = require('axios');

const fetchMovies = async ({ URL, PORT }) => {
  const res = await axios.get(`${URL}:${PORT}/movies`)
  return res.data;
};

const fetchSingleMovie = async ({ URL, PORT }, id) => {
  const response = await axios.get(`${URL}:${PORT}/movie/${id}`)
    .then(res => {
      return res;
    }).catch(err => {
      return err.response;
    });

  return response;
};

const addNewMovie = ({ URL, PORT }, movieName, movieYear) => {
  const data = {
    name: movieName,
    year: movieYear,
  };

  axios.post(`${URL}:${PORT}/movies`, data)
    .then(res => console.log(res.data))
    .catch(err => console.log(err.response.data.message));
};

module.exports = {
  fetchMovies,
  fetchSingleMovie,
  addNewMovie,
}