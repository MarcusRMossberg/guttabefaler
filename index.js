const app = require("./app"); // varsinainen Express-sovellus
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
