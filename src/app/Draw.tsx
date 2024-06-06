import React, { useState, useEffect } from 'react'

type Car = {
  alive: boolean,
  angle: number,
  center: number[],
  id: number,
  position: number[]
}
type Data = {
  cars: Car[],
}

const Draw = ({ cars } : Data) => {
  const [elem, setElem] = useState<HTMLElement | null>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  
  const getOffsets = () => {
    const board = document.getElementById('board')
    if(board) {
      setElem(board)
      const rect = board.getBoundingClientRect()
      setX(rect.left)
      setY(rect.top)
    }
  }

  window.addEventListener("resize", getOffsets)
  useEffect(getOffsets, [])

  return (
    <>
      <div
        className={``}
        style={{ top: `${y + 112}px` }}
      />
      { x + " " + y }
    </>
  )
}

export default Draw