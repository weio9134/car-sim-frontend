"use client"
import { useState, useEffect, useRef } from "react";
import Grid from "./Grid";
import Draw from "./Draw";

const EMPTY_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

type Cars = {
  alive: boolean,
  angle: number,
  center: number[],
  id: number,
  position: number[]
}

export default function Home() {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [response, setResponse] = useState("")
  const [carData, setCarData] = useState<Cars[]>([])
  const [gridValue, setGridValue] = useState(1)
  const [gen, setGen] = useState(1)
  const [showRadar, setShowRadar] = useState(false)
  const [hasGreen, setHasGreen] = useState(false)
  const [started, setStarted] = useState(false)

  const testing = async () => {
    const response = await fetch("/test")
    const data = await response.json()
    setResponse(data.message);
  }

  const start = async () => {
    // first send settings
    if(!hasGreen) {
      setResponse("NEED TO PUT DOWN A GREEN TILE")
      return
    }
    setStarted(true)
    
    const response = await fetch("/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        "board": board,
        "gen": gen,
       })
    });
    const data = await response.json();
    setResponse(data.message);

    await new Promise(f => setTimeout(f, 2000));
    getNewGenomes()
  }

  const getNewGenomes = async () => {
    const response = await fetch("/new_genome")
    const data = await response.json()
    setResponse(data.message);

    await new Promise(f => setTimeout(f, 2000));
  }

  const runSimFrame = async () => {
    const response = await fetch("/run_frame")
    const data = await response.json()
    setResponse(data.message)
    setCarData(data.cars)
    console.log(carData)
  }

  

  return (
    <main className="bg-[#90d0ea] py-8 flex min-h-screen flex-col items-center justify-center text-black">

      {/* settings navbar */}
      <div className={`flex w-screen justify-evenly pb-8`}>
        
        {/* map settings */}
        <div className={`flex flex-col gap-4 justify-center items-center`}>
          <h2 className={`text-lg font-semibold`}> Pick color to draw on map: </h2>
          <div className={`flex flex-row gap-2`}>
            <button className={`p-4 btn hover:bg-[#f0f4f2] hover:text-black hover:border-black ${gridValue == 0 && 'bg-[#f0f4f2] text-black border-black'}`} onClick={() => setGridValue(0)}>White</button>
            <button className={`p-4 btn hover:bg-black hover:text-white hover:border-white ${gridValue == 1 && 'bg-black text-white border-white'}`} onClick={() => setGridValue(1)}>Black</button>
            <button className={`p-4 btn hover:bg-[#00A96E] hover:text-white hover:border-white ${gridValue == 2 && 'bg-[#00A96E] text-white border-white'}`} onClick={() => setGridValue(2)}>Green</button>
          </div>
        </div>

        {/* sim settings */}
        <div className={`flex flex-col gap-4 justify-center items-center`}>
          <h2 className={`text-lg font-semibold`}> Modify the simulation's setting: </h2>
          <div className={`flex flex-row gap-4`}>
            <label className={`flex justify-center items-center`}>
              Generations:
              <input 
                className={`w-[75px] h-[45px] ml-2 border-black bg-white input input-bordered `}
                type="number" 
                value={gen} 
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  val > 0 ? setGen(val) : setGen(1)
                }} 
              />
            </label>
            
            <label className={`flex justify-center items-center`}>
              Show Radar:
              <input
                className={`ml-2 w-[30px] h-[30px] checkbox checkbox-primary`}
                type="checkbox"
                checked={showRadar}
                onChange={() => setShowRadar(!showRadar)}
              />
          </label>
          </div>
        </div>
      </div>

      <button onClick={runSimFrame}>Run Frame</button>
      <button onClick={testing}>Test</button>

      <div className={`flex items-center flex-col gap-2 mb-4`}>
        <button className={`btn btn-info text-black`} onClick={start}>Start Simulation</button>
        <p className={`mb`}>Status: {response}</p>
      </div>
      
      <Grid value={gridValue} board={board} setHasGreen={setHasGreen} block={started} />
      <Draw cars={carData} />

    </main>
  );
}

