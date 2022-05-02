import { nanoid } from "nanoid";
import { chessGame } from "./types";

const newGame = (owner: string, guest: string, ownerColor: string): chessGame => {
  const formations = [
    ["23456432", "11111111"],
    ["11111111", "23465432"],
  ];
  let newGame: chessGame = [];

  for (let i = 0; i < 6; i++) {
    if (i === 0) {
      newGame = [
        ...formations[0].map((formation) =>
          [...formation].map((piece) => ({
            uuid: nanoid(),
            id: parseInt(piece),
            owner: owner,
            moved: false,
            color: ownerColor,
          }))
        ),
      ];
    } else if (i === 5) {
      newGame = [
        ...newGame,
        ...formations[1].map((formation) =>
          [...formation].map((piece) => ({
            uuid: nanoid(),
            id: parseInt(piece),
            owner: guest,
            moved: false,
            color: ownerColor === "white" ? "rgb(50, 50, 50)" : "white",
          }))
        ),
      ];
    } else {
      newGame = [...newGame, Array.from({ length: 8 }).map((el) => null)];
    }
  }

  return newGame;
};

export default newGame;
