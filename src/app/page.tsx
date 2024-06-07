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
  const [response, setResponse] = useState("READY")
  const [carData, setCarData] = useState<Car[]>([])
  const [color, setcolor] = useState(1)
  const [gen, setGen] = useState(1)
  const [hasGreen, setHasGreen] = useState(false)
  const [sentSetting, setSentSettings] = useState(false)
  const [stop, setStop] = useState(false)

  const connect = async () => {
    setSentSettings(false)
    setStop(true)
    // check if valid map
    if(!hasGreen) {
      setResponse("NEED TO PUT DOWN A GREEN TILE")
      return
    }
    setStop(false)

    sendSettings()
    await new Promise(f => setTimeout(f, 1000));
    getGenome()
    await new Promise(f => setTimeout(f, 1000));
    setSentSettings(true)
  }

  const simLoop = async () => {
    setResponse("LOADING")
    await new Promise(f => setTimeout(f, 3000));
    setResponse("SIMULATING")
    console.log("bruh", stop)

    try {
      gen_loop:
      while(true) {
        sim_loop:
        for(let i = 0; i < 100; i++) {
          // await new Promise(f => setTimeout(f, 100));
          const response = await fetch("/run_frame")
          const data = await response.json()

          // console.log("NEW DATA:\n", data)
          if(!data.continue) break sim_loop
          if(data.stop) break gen_loop

          setCarData(data.cars)
          // console.log(gen)
        }
        
        const response = await fetch("/update_population")
        const data = await response.json()
        // console.log("NEW GEN", data)
        if(data.gen == 0 || data.stop) break gen_loop

        setResponse(data.message)
        getGenome()
      }

      setSentSettings(false)
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
    setSentSettings(false)
    setStop(true)
    setResponse("SIMULATION HAS STOPPED")

    await fetch("stop")
  }

  

  return (
    <main className="bg-[#90d0ea] py-8 flex min-h-screen flex-col items-center justify-center text-black">

      {/* settings navbar */}
      <div className={`flex w-screen justify-evenly pb-8`}>
        
        {/* map settings */}
        <div className={`flex flex-col gap-4 justify-center items-center`}>
          <h2 className={`text-lg font-semibold`}> Pick color to draw on map: </h2>
          <div className={`flex flex-row gap-2`}>
            <button className={`p-4 btn hover:bg-[#f0f4f2] hover:text-black hover:border-black ${color == 0 && 'bg-[#f0f4f2] text-black border-black'}`} onClick={() => setcolor(0)}>White</button>
            <button className={`p-4 btn hover:bg-black hover:text-white hover:border-white ${color == 1 && 'bg-black text-white border-white'}`} onClick={() => setcolor(1)}>Black</button>
            <button className={`p-4 btn hover:bg-[#00A96E] hover:text-white hover:border-white ${color == 2 && 'bg-[#00A96E] text-white border-white'}`} onClick={() => setcolor(2)}>Green</button>
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
                  sentSetting ? gen : val > 0 ? setGen(val) : setGen(1)
                }} 
              />
            </label>
          </div>
        </div>
      </div>

      {/* <button onClick={() => {}}>Run Frame</button> */}
      <button onClick={() => console.log(carData)}>PRINT CAR</button>

      <div className={`flex items-center flex-col gap-2 mb-4`}>
        <button 
          className={`btn btn-info text-black`} 
          onClick={() => {
            connect()
          }}
        > 
          Save settings 
        </button>
      

        <button 
          className={`btn btn-info text-black`} 
          onClick={simLoop}
        >
          Start Simulation
        </button>
        

        <button 
          className={`btn btn-info text-black`} 
          onClick={stopSim}
        >
          Stop Simulation
        </button>

        {/* <p className={`${!sentSetting && 'hidden'}`}> Running generation number: {genCounter + 1} </p> */}
        <p> Status: {response} </p>
      </div>
      
      <Grid 
        value={color} 
        board={board} 
        setHasGreen={setHasGreen} 
        block={sentSetting} 
        cars={carData} 
        setCars={setCarData}
      />

    </main>
  );
}

