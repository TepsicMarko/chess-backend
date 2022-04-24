import express from "express";
import http from "http";
import { nanoid } from "nanoid";
import { Server } from "socket.io";
import newGame from "./newGame";
import { chessGame, position } from "./types";

interface movePieceParams {
  id: string;
  newPosition: position;
  selectedPiece: {
    id: number;
    position: position;
  };
}

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
    const id = nanoid();
    games[id] = newGame;
    socket.emit("game created", { id, game: games[id] });
  });

  socket.on("join game", (data) => {
    console.log("join game");
    const id = data.id;
    games[id] = newGame;
    socket.emit("game joined", { id, game: games[id] });
  });

  socket.on("move piece", ({ id, selectedPiece, newPosition }: movePieceParams) => {
    console.log("move piece");
    const currentPosition = selectedPiece.position;
    const newChessBoard = [...games[id]];

    newChessBoard[newPosition.z][newPosition.x] = {
      id: selectedPiece.id,
      enemy: newChessBoard[currentPosition.z][currentPosition.x]?.enemy || false,
      moved: true,
    };
    newChessBoard[currentPosition.z][currentPosition.x] = null;

    games[id] = newChessBoard;

    io.emit("piece moved", { game: games[id] });
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
