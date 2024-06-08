"use client"
import { useState, useEffect, useRef } from "react";
import Grid from "./components/Grid";
import { Car } from "./components/Types";
import { run } from "node:test";

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

export default function Home() {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [response, setResponse] = useState("Draw a map, save the settings, then start the simulation!")
  const [carData, setCarData] = useState<Car[]>([])
  const [color, setColor] = useState(1)
  const [gen, setGen] = useState(1)
  const [hasGreen, setHasGreen] = useState(false)
  const [connected, setConnected] = useState(false)
  const [stop, setStop] = useState(true)
  const [resetAll, setResetAll] = useState(false)
  const [delay, setDelay] = useState(0)
  const [count, setCount] = useState(2)

  const connect = async () => {
    // check if valid map
    if(!hasGreen) {
      setResponse("NEED TO PUT DOWN A GREEN TILE")
      return
    }
    setResetAll(false)

    // pass in settings and set up genomes
    sendSettings()
    await new Promise(f => setTimeout(f, 1000));
    getGenome()
    await new Promise(f => setTimeout(f, 1000));
    setResponse("READY TO SIMULATE")
    setConnected(true)
    setStop(true)
  }

  const simLoop = async () => {
    if(response !== "READY TO SIMULATE") {
      setResponse("PLEASE SAVE THE SETTINGS FIRST")
      return
    }
    
    setStop(false)
    setResponse("LOADING")
    await new Promise(f => setTimeout(f, 3000));
    setResponse("SIMULATING")

    try {
      gen_loop:
      while(true) {
        sim_loop:
        for(let i = 0; i < 1000; i++) {
          await new Promise(f => setTimeout(f, delay));
          const response = await fetch("/run_frame")
          const data = await response.json()

          if(!data.continue) break sim_loop
          if(data.stop) break gen_loop

          setCarData(data.cars)
        }
        
        await new Promise(f => setTimeout(f, 1000));
        const response = await fetch("/update_population")
        const data = await response.json()
        if(data.gen == 0 || data.stop) break gen_loop

        getGenome()
        setResponse("UPDATED NEW GENERATION")
      }

      setConnected(false)
      setResponse("SIMULATION OVER")
    } catch (error) {
      console.log("ERROR:", error)
    }
  }

  // setup sim settings
  const sendSettings = async () => {
    const response = await fetch("/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        "board": board,
        "gen": gen,
        "count": count
       })
    });
    const data = await response.json();
    setResponse(data.message);
  }

  // create new genome
  const getGenome = async () => {
    const response = await fetch("/new_genome")
    const data = await response.json()
    setResponse(data.message);
  }

  const stopSim = async () => {
    setConnected(false)
    setStop(true)
    setResponse("SIMULATION HAS STOPPED")
    await fetch("stop")
  }

  const runFrame = async () => {
    const response = await fetch("/run_frame")
    const data = await response.json()
    setCarData(data.cars)
  }

  const reset = async () => {
    setResetAll(true)
    setBoard(EMPTY_BOARD)
    setResponse("Draw a map, save the settings, then start the simulation!")
    setCarData([])
    setColor(1)
    setGen(1)
    setHasGreen(false)
    setConnected(false)
    setStop(true)
    setDelay(0)
    setCount(2)
    await fetch("reset")
  }

  

  return (
    <main className="bg-[#90d0ea] py-8 flex min-h-screen flex-col items-center justify-center text-black">

      {/* settings navbar */}
      <div className={`flex w-screen justify-evenly pb-8`}>
        
        {/* map settings */}
        <div className={`flex flex-col gap-4 justify-center items-center`}>
          <h2 className={`text-lg font-semibold`}> Pick color to draw on map: </h2>
          <div className={`flex flex-row gap-2`}>
            {/* draw white */}
            <button className={`p-4 btn hover:bg-[#f0f4f2] hover:text-black hover:border-black ${color == 0 && 'bg-[#f0f4f2] text-black border-black'}`} onClick={() => setColor(0)}>White</button>
            {/* draw black */}
            <button className={`p-4 btn hover:bg-black hover:text-white hover:border-white ${color == 1 && 'bg-black text-white border-white'}`} onClick={() => setColor(1)}>Black</button>
            {/* draw green */}
            <button className={`p-4 btn hover:bg-[#00A96E] hover:text-white hover:border-white ${color == 2 && 'bg-[#00A96E] text-white border-white'}`} onClick={() => setColor(2)}>Green</button>
          </div>
        </div>

        {/* sim settings */}
        <div className={`flex flex-col gap-4 justify-center items-center`}>
          <h2 className={`text-lg font-semibold`}> Modify the simulation's setting: </h2>
          <div className={`flex flex-row gap-4`}>
            {/* mod gen */}
            <label className={`flex justify-center items-center`}>
              Generations:
              <input 
                className={`w-[75px] h-[45px] ml-2 border-black bg-white input input-bordered `}
                type="number" 
                value={gen} 
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  connected ? gen : val > 0 ? setGen(val) : setGen(1)
                }} 
              />
            </label>
            {/* mod delay */}
            <label className={`flex justify-center items-center`}>
              Delay:
              <input 
                className={`w-[75px] h-[45px] ml-2 border-black bg-white input input-bordered `}
                type="number" 
                value={delay} 
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  connected ? delay : val >= 0 ? setDelay(val) : setDelay(0)
                }} 
              />
            </label>
            {/* mod cars */}
            <label className={`flex justify-center items-center`}>
              Cars:
              <input 
                className={`w-[75px] h-[45px] ml-2 border-black bg-white input input-bordered `}
                type="number" 
                value={count} 
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  connected ? count : val > 1 ? setCount(val) : setCount(2)
                }} 
              />
            </label>
          </div>
        </div>
      </div>

      <button onClick={runFrame}>Run Frame</button>
      {/* <button onClick={() => console.log(carData)}>PRINT CAR</button> */}

      <div className={`flex items-center flex-col gap-2 mb-4 max-w-[608px] w-full`}>
        <div className={`flex flex-row justify-between w-full`}>
          <button
            className={`btn btn-info text-black`}
            onClick={() => {
              connect()
            }}
          >
            Save Settings
          </button>
          <button
            className={`btn btn-info text-black`}
            onClick={() => {
              if(stop) {
                simLoop()
              } else {
                setStop(true)
                stopSim()
              }
            }}
          >
            {!stop ? "Stop" : "Start"} Simulation
          </button>
          
          <button
            className={`btn btn-info text-black`}
            onClick={reset}
          >
            Reset All
          </button>
        </div>

        {/* <p className={`${!sentSetting && 'hidden'}`}> Running generation number: {genCounter + 1} </p> */}
        <p> Status: {response} </p>
      </div>
      
      <Grid 
        value={color} 
        board={board} 
        setBoard={setBoard}
        setHasGreen={setHasGreen} 
        block={connected} 
        cars={carData} 
        setCars={setCarData}
        reset={resetAll}
      />

    </main>
  );
}

