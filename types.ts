interface chessPieceInfo {
  id: number;
  enemy: boolean;
  moved: boolean;
}

export interface position {
  x: number;
  z: number;
}

export type chessGame = (chessPieceInfo | null)[][];
