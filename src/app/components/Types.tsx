export type Car = {
  alive: boolean,
  angle: number,
  center: number[],
  corners: number[][],
  id: number,
  position: number[],
  radars: number[]
}

export type BoardProps = {
  value: number,
  board: number[][],
  setBoard: React.Dispatch<React.SetStateAction<number[][]>>,
  setHasGreen: React.Dispatch<React.SetStateAction<boolean>>,
  block: boolean,
  cars: Car[],
  setCars: React.Dispatch<React.SetStateAction<Car[]>>,
  reset: boolean
  }
  
  export type PieceProps = {
    x: number,
    y: number,
    v: number,
    board: number[][],
    setBoard: React.Dispatch<React.SetStateAction<number[][]>>,
    setHasGreen: React.Dispatch<React.SetStateAction<boolean>>,
    reset: boolean
  }

export type DrawProps = {
  cars: Car[],
  map: number[][],
  setCars: React.Dispatch<React.SetStateAction<Car[]>>,
}

export type DisplayCarProp = {
  car: Car,
  map: number[][],
  group: Car[],
  setGroup: React.Dispatch<React.SetStateAction<Car[]>>,
}