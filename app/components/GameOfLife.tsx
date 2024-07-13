"use client"

import Grid from "./Grid";
import Header from "./Header";

export default function GameOfLife() {
  return (
    <div className="flex justify-around flex-wrap">
      <div className=" sm:m-3">
        <Header/>
        <Grid/>
      </div>
    </div>
  )
}
