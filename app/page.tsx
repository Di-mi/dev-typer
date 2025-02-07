"use server"
import Typer from "./components/Typer/Typer";

import {InfoModal } from "./components/InfoModal";
import { Suspense } from "react";

export default async function App() {
  return (
    <div>
      <Typer  />
      <Suspense>
        <InfoModal/>
      </Suspense>
    </div>
  )

}
