const { server, importData } = require('./provider');
const port = process.env.PORT || 3000;

importData();

server.listen(port, () => console.log(`Listening on port ${port}...`));