import React, { ChangeEvent, useEffect, useState } from 'react';


const rows: number = 30;
const cols: number = 30;
type Matrix = number[][];
const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

export default function Grid() {
  const [grid, setGrid] = useState(matrix);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // State to store the value of the range input
  const [rangeValue, setRangeValue] = useState(500); // Initial value is set to 50

  // Handler function for onChange event
  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    if (intervalId) clearInterval(intervalId);
    if(running) setRunning(false)
  };

  const playSound = () => {
    const audio = new Audio('/sound.mp3'); 
    audio.play();
  };

  const handler = (i: number, j: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[i] = [...prevGrid[i]];
      newGrid[i][j] = newGrid[i][j] === 0 ? 1 : 0;
      return newGrid;
    });
  };

  const nextStep = () => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.slice());
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let alive_neighbors = 0;

          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;

              const ni = i + x;
              const nj = j + y;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && Math.abs(prevGrid[ni][nj]) === 1) alive_neighbors++;
            }
          }

          if (prevGrid[i][j] === 1) {
            if (alive_neighbors <= 1 || alive_neighbors >= 4) {
              newGrid[i][j] = -1;
            }
          } else if (prevGrid[i][j] === 0 && alive_neighbors === 3) {
            newGrid[i][j] = 2;
          }
        }
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newGrid[i][j] === -1) {
            newGrid[i][j] = 0;
          }
          if (newGrid[i][j] === 2) {
            newGrid[i][j] = 1;
          }
        }
      }
      return newGrid;
    });
    playSound()
    setCount((count) => count + 1);
  };

  const startStop = () => {
    if (running) {
      if (intervalId) clearInterval(intervalId);
    } else {
      const id = setInterval(nextStep, 1000 - rangeValue);
      setIntervalId(id);
    }
    setRunning(!running);
  };

  const reset = () => {
    setGrid(matrix);
    if (intervalId) clearInterval(intervalId);
    setRunning(false);
    setRangeValue(500);
    setCount(0);
  }; 

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className='pt-1'>
      {grid.map((row, i) => {
        return (
          <div className='flex justify-center ' key={i}>
            {row.map((col, j) => {
              return (
                <div
                  onClick={() => handler(i, j)}
                  className={
                    col
                      ? 'w-3 h-3 sm:w-4 sm:h-4 text-[transparent] border-[.5px] m-[0px] sm:m-[1.5px] bg-green-400 cursor-pointer'
                      : 'w-3 h-3 sm:w-4 sm:h-4 text-[transparent] border-[.5px] m-[0px] sm:m-[1.5px] cursor-pointer'
                  }
                  key={i + j}
                ></div>
              );
            })}
          </div>
        );
      })}
      <div className="flex flex-row justify-center">
        <button className={running ? "w-[5rem] px-4 py-2 m-2 bg-red-500 text-white rounded cursor-pointer hover:-translate-y-0.5" : "w-[5rem] px-4 py-2 m-2 bg-blue-500 text-white rounded cursor-pointer hover:-translate-y-0.5"} onClick={startStop}>{running ? "Stop" : "Start"}</button>
        <button className="w-[5rem] px-4 py-2 m-2 bg-blue-500 text-white rounded cursor-pointer hover:-translate-y-0.5" onClick={nextStep}>Next</button>
        <button className="w-[5rem] px-4 py-2 m-2 bg-blue-500 text-white rounded cursor-pointer hover:-translate-y-0.5" onClick={reset}>Reset</button>
      </div>
      <div className='border-[1.5px] border-white text-white sm:fixed bottom-[100px] right-[100px] rounded px-5 py-3'>
        <div>
          <label htmlFor="rangeInput">Set Speed</label><br />
          <input
            type="range"
            id="rangeInput"
            min="200"
            max="800"
            value={rangeValue}
            onChange={handleRangeChange}
          />
          <p>Speed: {rangeValue}</p>
        </div>
        <div>
          <p>Count: {count}</p>
        </div>
      </div>
    </div>
  );
}
