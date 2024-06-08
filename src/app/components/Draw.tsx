import React, { useState, useEffect } from 'react'
import { Car, DrawProps, DisplayCarProp } from './Types'
import Image from 'next/image'
import CarPNG from '/public/car.png'


const DisplayCar = ({ car, map, group, setGroup } : DisplayCarProp) => {
  const [center, setCenter] = useState(car.center)
  const [corners, setCorners] = useState(car.corners)
  const [offset, setOffset] = useState([0, 0])

  const get_offset = () => {
    let minTop = center[1]
    let minLeft = center[0]
    corners?.forEach((c: number[]) => {
      minTop = Math.min(minTop, c[1])
      minLeft = Math.min(minLeft, c[0])
    })
    setOffset([
      center[0] - (center[0] - minLeft), 
      center[1] - (center[1] - minTop)
    ])
  }

  const degToRad = (deg: number) => (deg * Math.PI) / 180.0
  const withinBound = (x: number, y: number) => {
    if(x < 0 || x > 600 || y < 0 || y > 600) return false
    const col = Math.round(x/60)
    const row = Math.round(y/60)
    return map[row][col] != 0
  }

  const update_car = () => {
    // check collision between all corners
    corners?.forEach((c: number[]) => {
      console.log(c)
      if(!withinBound(c[0], c[1])) {
        car.alive = false
        return
      }
    })

    // update radar
    const angle = car.angle
    for(let i = -90; i < 100; i += 45) {
      let length = 0
      let x = Math.floor(center[0] + Math.cos(degToRad(360 - (angle + i))) * length)
      let y = Math.floor(center[1] + Math.sin(degToRad(360 - (angle + i))) * length)

      // while the radars dont touch the border and within 100
      while ((x >= 0 && x < 600) && (y >= 0 && y < 600) && withinBound(x, y) && (length < 100)) {
        length++
        x = Math.floor(center[0] + Math.cos(degToRad(360 - (angle + i))) * length)
        y = Math.floor(center[1] + Math.sin(degToRad(360 - (angle + i))) * length)
      }

      // calc radar length from center to its end
      car.radars[(i + 90) / 45] = Math.floor(Math.sqrt(Math.pow(x - center[0], 2) + Math.pow(y - center[1], 2)))
    }
  }

  useEffect(() => {
    if(car.alive) {
      setCenter(car.center)
      setCorners(car.corners)
        console.log(car.id, car.alive, car.center, car.corners, corners)
      get_offset()
      update_car()
      setGroup(group)
    }
  }, [car.center])
  
  return (
    <div 
      key={car.id}
      className={`absolute ${!car.alive && 'hidden'}`}
      style={{
        top: `${offset[1]}px`, 
        left: `${offset[0]}px`,
        transform: `rotate(${car.angle}deg)`
      }}
    >
      <Image
        src={CarPNG}
        width={40}
        height={40}
        alt={`car png`}
      />
    </div>
  )
}


const Draw = ({ cars, map, setCars } : DrawProps) => {
  const sendUpdatedCars = async () => {
    await fetch("/update_cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        "cars": cars,
       })
    });
  }

  sendUpdatedCars()
  
  return (
    <>
     {cars?.map(car => (
        car != null && car.alive && 
        <DisplayCar 
          car={car} 
          map={map} 
          key={`${car.id}-${car.position.join(',')}`}
          group={cars}
          setGroup={setCars}
        />
      ))}
    </>
  )
}

export default Draw