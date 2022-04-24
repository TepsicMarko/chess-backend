import express from "express";
import http from "http";
import { Server } from "socket.io";
import newGame from "./newGame";
import { chessGame } from "./types";

let games: { [key: string]: chessGame } = {};

const port = 3001;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("create game", (data) => {
    console.log("create game");
    const id = "123456";
    games[id] = newGame;
    socket.emit("game created", { id, game: games[id] });
  });

  socket.on("join game", (data) => {
    console.log("join game");
    const id = data.id;
    games[id] = newGame;
    socket.emit("game joined", { id, game: games[id] });
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
