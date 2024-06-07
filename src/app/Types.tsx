export type Cars = {
  alive: boolean,
  angle: number,
  center: number[],
  id: number,
  position: number[]
}

export type PieceProps = {
  x: number,
  y: number,
  v: number,
  board: number[][],
  setHasGreen: React.Dispatch<React.SetStateAction<boolean>>
}

export type BoardProps = {
  value: number,
  board: number[][],
  setHasGreen: React.Dispatch<React.SetStateAction<boolean>>,
  block: boolean,
  cars: Cars[]
}

export type DrawProps = {
  cars: Cars[]
}