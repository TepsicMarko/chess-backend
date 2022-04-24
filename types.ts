interface chessPieceInfo {
  id: number;
  enemy: boolean;
  moved: boolean;
}

export type chessGame = (chessPieceInfo | null)[][];
