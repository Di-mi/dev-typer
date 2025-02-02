"use server"
import Typer from "./components/Typer/Typer";

import {InfoModal } from "./components/InfoModal";


export default async function App() {
  return (
    <div>
      <Typer  />
      <InfoModal/>
    </div>
  )

}
