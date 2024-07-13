import React, { useEffect, useState } from 'react'
import { start } from 'repl';

const rows: number = 30;
const cols: number = 30;
type Matrix = number[][]
const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

export default function Grid() {
    const [grid, setGrid] = useState(matrix);
    const [running, setRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const handler = (i: number, j: number) => {
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[i] = [...prevGrid[i]];
            newGrid[i][j] = newGrid[i][j] === 0 ? 1 : 0;
            return newGrid;
        });
    }

    const nextStep = () => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.slice());
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
    }

    const startStop = () => {
        if (running) {
            if (intervalId) clearInterval(intervalId);
        } else {
            const id = setInterval(nextStep, 500);
            setIntervalId(id);
        }
        setRunning(!running);
    }

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);



    return (
        <div className='pt-1'>
            {grid.map((row, i) => {
                return <div className='flex justify-center ' key={i}>{row.map((col, j) => {
                    return <div onClick={() => handler(i, j)} className={col?'w-3 h-3 sm:w-4 sm:h-4 text-[transparent] border-[.5px] m-[0px] sm:m-[1.5px] bg-green-400 cursor-pointer	':'w-3 h-3 sm:w-4 sm:h-4 text-[transparent] border-[.5px] m-[0px] sm:m-[1.5px] cursor-pointer'} key={i + j}></div>
                })}</div>
            })}
            <div className="flex flex-row justify-center">
                <button className="btn-custom hover:-translate-y-0.5" onClick={startStop}>{running?"stop":"start"}</button>
                <button className="btn-custom hover:-translate-y-0.5" onClick={nextStep}>Next</button>
                <button className="btn-custom hover:-translate-y-0.5" onClick={()=>setGrid(matrix)}>Reset</button>
            </div>
        </div>
    )
}
