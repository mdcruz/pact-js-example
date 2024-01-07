const app = require('express')();
const cors = require('cors');
const consumeMovieStream = require('./src/service/kafka');
const streamHandler = require('./src/movies/movie.handler');
const port = 8080;

const init = () => {
    app.use(cors());

    consumeMovieStream(streamHandler);

    return app.listen(port, () => console.log(`Provider API listening on port ${port}...`));
};

init();