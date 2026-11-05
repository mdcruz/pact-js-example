const produce = require("./src/movie.producer");

produce("test", "2023").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
