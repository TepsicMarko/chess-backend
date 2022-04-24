import { chessGame } from "./types";

let newGame: chessGame = [
  [
    { id: 2, enemy: true, moved: false },
    { id: 3, enemy: true, moved: false },
    { id: 4, enemy: true, moved: false },
    { id: 5, enemy: true, moved: false },
    { id: 6, enemy: true, moved: false },
    { id: 4, enemy: true, moved: false },
    { id: 3, enemy: true, moved: false },
    { id: 2, enemy: true, moved: false },
  ],
  [
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
    { id: 1, enemy: true, moved: false },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
    { id: 1, enemy: false, moved: false },
  ],
  [
    { id: 2, enemy: false, moved: false },
    { id: 3, enemy: false, moved: false },
    { id: 4, enemy: false, moved: false },
    { id: 5, enemy: false, moved: false },
    { id: 6, enemy: false, moved: false },
    { id: 4, enemy: false, moved: false },
    { id: 3, enemy: false, moved: false },
    { id: 2, enemy: false, moved: false },
  ],
];

export default newGame;
