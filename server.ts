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
  ownerColor: string;
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
      state: [[]],
      owner: username,
      ownerColor: color,
      nextTurn: username,
      guest: "",
    };

    socket.join(gameId);
    socket.emit("join lobby", { gameId, lobby: { owner: username, guest: "" } });
  });

  socket.on("join game", ({ gameId, username }) => {
    console.log("join game");
    if (games[gameId]) {
      const color = games[gameId].ownerColor === "white" ? "rgb(50, 50, 50)" : "white";

      games[gameId].guest = username;

      socket.join(gameId);
      socket.emit("join lobby", { gameId, username, color });
    } else socket.emit("join error", { message: "Game doesn't exists" });
  });

  socket.on("add user to loby", ({ gameId, username }) => {
    console.log("add user to loby");
    const isOwner = games[gameId].owner === username;

    if (!isOwner) {
      io.to(gameId).emit("guest joined lobby", {
        owner: games[gameId].owner,
        guest: username,
      });
    }
  });

  socket.on("leave lobby", ({ gameId, username }) => {
    if (games[gameId]) {
      const isOwner = games[gameId].owner === username;

      if (!isOwner) {
        io.to(gameId).emit("guest left lobby", {
          owner: games[gameId].owner,
          guest: "",
        });
      } else {
        io.to(gameId).emit("owner left lobby");
        delete games[gameId];
      }
    }
  });

  socket.on("start game", ({ gameId }) => {
    console.log("start game");
    const { owner, guest, ownerColor } = games[gameId];

    games[gameId].state = newGame(owner, guest, ownerColor);

    io.to(gameId).emit("game started", { gameId, game: games[gameId] });
  });

  socket.on("move piece", ({ gameId, selectedPiece, newPosition }: movePieceParams) => {
    console.log("move piece");
    const currentPosition = selectedPiece.position;
    const newChessBoard = [...games[gameId].state];
    const selectedPieceData = newChessBoard[currentPosition.z][currentPosition.x];

    selectedPieceData &&
      (newChessBoard[newPosition.z][newPosition.x] = {
        ...selectedPieceData,
        id: selectedPiece.id,
        moved: true,
      });
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
