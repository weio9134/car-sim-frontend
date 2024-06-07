import React, { useState, useEffect } from 'react'
import { Cars, DrawProps } from './Types'
import Image from 'next/image'
import CarPNG from '/public/car.png'

const Draw = ({ cars } : DrawProps) => {
  console.log(cars)
  return (
    <>
      <div className={`text-black`}>
        {cars.map(car => (
          <div 
            key={car.id}
            className={`absolute`}
            style={{
              top: `${car.center[1]}px`, 
              left: `${car.center[0]}px`,
              transform: `rotate(${-car.angle}deg)`
            }}
          >
            <Image
              src={CarPNG}
              width={40}
              height={40}
              alt={`car png`}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default Draw