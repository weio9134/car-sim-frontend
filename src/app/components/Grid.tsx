import React, { useState, useEffect } from 'react';
import Draw from './Draw';
import { PieceProps, BoardProps } from './Types';


const Piece = ({x, y, v, board, setHasGreen}: PieceProps) => {
  const [color, setColor] = useState('white')

  const handleClick = () => {
    if(board[x][y] == 2 && v != 2) setHasGreen(false)
    
    board[x][y] = v
    if(v == 2) {
      for(let i = 0; i < 10; i++)
        for(let j = 0; j < 10; j++)
          if(board[i][j] == 2) {
            board[i][j] = 0
            const elem = document.getElementById(`${i}-${j}`)
            if (elem) elem.style.backgroundColor = "white";
          }

      board[x][y] = 2
      const elem = document.getElementById(`${x}-${y}`)
      if (elem) elem.style.backgroundColor = "#00FF00";
      setHasGreen(true)
    }
  }

  return (
    <div
      id={`${x}-${y}`}
      className={`w-[60px] h-[60px] hover:cursor-pointer`}
      style={{ backgroundColor: color }}
      onClick={() => {
        handleClick()
        setColor(board[x][y] === 0 ? 'white' : (board[x][y] === 1 ? 'black' : '#00FF00'));
      }}
    />
  )
}


const Grid = ({ value, board, setHasGreen, block, cars, setCars }: BoardProps) => {
  return (
    <>
      <div
        id={`board`}
        className='grid grid-cols-10 grid-rows-10 border-4 border-white'
      >
        { block && 
          <div id={`map-cover`} className={`absolute w-[600px] h-[600px] z-10`}>
            <Draw cars={cars} setCars={setCars} map={board} />
          </div>
        }

        { board.map((row: number[], x: number) => (
          row.map((cell: number, y: number) => (
            <Piece
              key={`${x}-${y}`}
              x={x} y={y}
              v={value}
              board={board}
              setHasGreen={setHasGreen}
            />
          ))
        ))}
      </div>
    </>
  );
};

export default Grid;
