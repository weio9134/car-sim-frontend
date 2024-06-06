"use client"
import { useState, useEffect, useRef } from "react";

type Cars = {
  alive: boolean,
  angle: number,
  center: number[],
  id: number,
  position: number[]
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [begun, setBegun] = useState(false);
  const [carData, setCarData] = useState<Cars[]>([]);
  
  const connect = async () => {
    const response = await fetch("/connect")
    const data = await response.json()
    setResponse(data.message)
  }

  const sendMessage = async () => {
    const response = await fetch("/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    setResponse(data.message);
  }

  const start = async () => {
    const response = await fetch("/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({gen: "1"})
    });
    const data = await response.json();
    setResponse(data.message);
  }

  const getNewGenomes = async () => {
    const response = await fetch("/new_genome")
    const data = await response.json()
    setResponse(data.message);
    console.log(data)
  }

  const runSimFrame = async () => {
    const response = await fetch("/run_frame")
    const data = await response.json()
    setResponse(data.message)
    setCarData(data.cars)
    console.log(carData)
  }

  const testing = async () => {
    const response = await fetch("/test")
    const data = await response.json()
    setResponse(data.message);
  }



  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-2 bg-white text-black">
      <button onClick={connect}>Connect</button>
      <button onClick={start}>Start</button>
      <button onClick={getNewGenomes}>New Genomes</button>
      <button onClick={runSimFrame}>Run Frame</button>
      <button onClick={testing}>Test</button>
      <div className="flex flex-col gap-8 mt-8">
        <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send Message</button>
        <p>Response from server: {response}</p>
      </div>
    </main>
  );
}
