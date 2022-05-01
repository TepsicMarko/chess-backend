interface chessPieceInfo {
  uuid: string;
  id: number;
  owner: string;
  moved: boolean;
  color: string;
}

export interface position {
  x: number;
  z: number;
}

export type chessGame = (chessPieceInfo | null)[][];
