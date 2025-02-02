"use server"
import path from "path";
import { SUPPORTED_LANGUAGES } from "../common/types";
import fs from 'fs';



async function retrieveTextFromDb(language: SUPPORTED_LANGUAGES) {
  const db = {
    JavaScript: 'app/server/db/typescript.txt',
    Python: 'app/server/db/python.txt',
    Rust: 'app/server/db/rust.txt'
  }
  const file = await fs.promises.readFile(path.resolve(db[language]), 'utf8');
  const textList = file.split('\n');
  const textSample = []
  for (let i = 0; i < 5; i++) {
    textSample.push(textList[Math.round(Math.random() * (textList.length - 1))] );
  }
  return textSample.join('\n');;
}




export async function getText(selectedLanguage: SUPPORTED_LANGUAGES = 'JavaScript') {
  return await retrieveTextFromDb(selectedLanguage);
}
