import express from "express";
import http from "http";
import { nanoid } from "nanoid";
import { Server } from "socket.io";
import newGame from "./newGame";
import { chessGame, position } from "./types";

interface movePieceParams {
  gameId: string;
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

const port = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.8.21:3000",
      "https://3d-chess.vercel.app",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("create game", ({ username, color }) => {
    console.log("create game");
    const gameId = nanoid();
    games[gameId] = {
      state: newGame(username, color),
      owner: username,
      nextTurn: username,
      guest: "",
    };
    socket.join(gameId);
    socket.emit("game created", { gameId, game: games[gameId] });
  });

  socket.on("join game", ({ gameId, username }) => {
    console.log("join game");
    games[gameId].state = games[gameId].state.map((el) =>
      el.map((piece) =>
        piece ? (!piece.owner ? { ...piece, owner: username } : piece) : piece
      )
    );
    games[gameId].guest = username;
    socket.join(gameId);
    socket.emit("game joined", { gameId, game: games[gameId] });
  });

  socket.on("move piece", ({ gameId, selectedPiece, newPosition }: movePieceParams) => {
    console.log("move piece");
    const currentPosition = selectedPiece.position;
    const newChessBoard = [...games[gameId].state];

    newChessBoard[newPosition.z][newPosition.x] = {
      id: selectedPiece.id,
      owner: newChessBoard[currentPosition.z][currentPosition.x]?.owner || "",
      moved: true,
      color: newChessBoard[currentPosition.z][currentPosition.x]?.color || "",
    };
    newChessBoard[currentPosition.z][currentPosition.x] = null;

    games[gameId].state = newChessBoard;
    games[gameId].nextTurn =
      games[gameId].nextTurn === games[gameId].owner
        ? games[gameId].guest
        : games[gameId].owner;

    io.to(gameId).emit("piece moved", games[gameId]);
  });

  socket.on("promote pawn", ({ gameId, from, to }) => {
    const game = [...games[gameId].state];

    game[from.z][from.x]!.id = to;

    games[gameId].state = game;
    io.to(gameId).emit("pawn promoted", games[gameId]);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
