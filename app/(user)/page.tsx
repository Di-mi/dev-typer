"use server"
import Typer from "lib/components/Typer/Typer";

import {InfoModal } from "lib/components/InfoModal";
import { Suspense } from "react";
import { getAllTextByLanguage } from "lib/components/Typer/server";
import { SUPPORTED_LANGUAGES } from "lib/common/consts";
import { SUPPORTED_LANGUAGES_TYPE } from "lib/common/types";

export default async function App() {
  const textByLanguage = {}
  
  for (const language of SUPPORTED_LANGUAGES) {
    const text = await getAllTextByLanguage(language); 
    textByLanguage[language] = text
  }

  const randomSeed = Array.from({length: 5}, () => Math.random())

  return (
    <div>
      <Typer 
        textByLanguage={textByLanguage as Record<SUPPORTED_LANGUAGES_TYPE, string[]>}
        randomSeed={randomSeed}
      />
      <Suspense>
        <InfoModal/>
      </Suspense>
    </div>
  )

}
