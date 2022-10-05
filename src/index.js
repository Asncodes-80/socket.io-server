/**
 * # Socket.io Server
 *
 * Connect to socket.io endpoint connection and use that in socket.io client
 * with specific route name.
 *
 * ## Features
 *
 * Base-on latest version of Socket.io:
 * - Express support in https server.
 * - Cors support for ReactJS|AngularJS|VueJS as standalone cross applications.
 * - Sock_Stream Support in specific intervals
 */

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const sockStream = require("socket.io-stream");

io.of("/checkout").on("connection", (socket) => {
  const handshaking = socket.request;
  console.log(handshaking);
  const { _query } = handshaking;
  console.log(`Connected...\n JWT: ${_query.token}`);

  let i = 1;
  var timerStream = setInterval(() => {
    let stream = sockStream.createStream();
    // As real data stream, by socket stream method
    sockStream(socket).emit("guestTraffic", stream, {
      entry: `Guest${i}`,
    });

    // Normal evolve to io.client
    socket.emit("guestTraffic", {
      entry: `Guest${i}`,
    });

    i += 1;
  }, 5000);

  /** Successful Client connection to Socket.io Server */
  socket.on("conn", (msg) => {
    // Log into server, this is client message
    console.log(msg);
    // Send ACK to io.client
    socket.emit("isConnect", true);
  });

  socket.on("disconnect", () => {
    console.log("Socket.io Server is Disconnecting");
    socket.emit("isConnect", false);
    clearInterval(timerStream);
  });
});

http.listen(8080, () => {
  console.log("Your Server port is 8080");
});
