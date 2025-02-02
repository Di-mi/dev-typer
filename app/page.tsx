"use server"
import Typer from "./components/Typer/Typer";

import {InfoModal } from "./components/InfoModal";


export default async function App() {
  return (
    <div>
      <h1 className="text-4xl pt-6 font-bold text-center mb-6 text-orange-400 animate-[flicker_1.5s_infinite] tracking-wider font-mono">
        ░▒▓ DEV TYPER ▓▒░
      </h1>
      <Typer  />
      <InfoModal/>
    </div>
  )

}
