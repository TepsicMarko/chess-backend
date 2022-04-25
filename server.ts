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

interface gameInfo {
  state: chessGame;
  owner: string;
  guest: string;
  nextTurn: string;
}

let games: { [key: string]: gameInfo } = {};
games = {};

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

  socket.on("create game", ({ username, color }) => {
    console.log("create game");
    const id = nanoid();
    games[id] = {
      state: newGame(username, color),
      owner: username,
      nextTurn: username,
      guest: "",
    };
    socket.emit("game created", { id, game: games[id] });
  });

  socket.on("join game", ({ id, username }) => {
    console.log("join game");
    games[id].state = games[id].state.map((el) =>
      el.map((piece) =>
        piece ? (!piece.owner ? { ...piece, owner: username } : piece) : piece
      )
    );
    games[id].guest = username;
    socket.emit("game joined", { id, game: games[id] });
  });

  socket.on("move piece", ({ id, selectedPiece, newPosition }: movePieceParams) => {
    console.log("move piece");
    const currentPosition = selectedPiece.position;
    const newChessBoard = [...games[id].state];

    newChessBoard[newPosition.z][newPosition.x] = {
      id: selectedPiece.id,
      owner: newChessBoard[currentPosition.z][currentPosition.x]?.owner || "",
      moved: true,
      color: newChessBoard[currentPosition.z][currentPosition.x]?.color || "",
    };
    newChessBoard[currentPosition.z][currentPosition.x] = null;

    games[id].state = newChessBoard;
    games[id].nextTurn =
      games[id].nextTurn === games[id].owner ? games[id].guest : games[id].owner;

    io.emit("piece moved", games[id]);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
