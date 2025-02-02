"use server"
import Typer from "./components/Typer/Typer";

import {InfoModal } from "./components/InfoModal";
import { Suspense } from "react";

export default async function App() {
  return (
    <div>
      <Typer  />
      <Suspense fallback={<div>Loading...</div>}>
        <InfoModal/>
      </Suspense>
    </div>
  )

}
