"use server"
import { SUPPORTED_LANGUAGES } from "../common/types";



async function retrieveTextFromDb(language: SUPPORTED_LANGUAGES) {
  const db = {
    JavaScript: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/typescript-KKDE6rGkQ28yKVtQ1DXHUxNa04AfZK.txt',
    Python: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/python-46Hk3ESFtISTrzb4GLDtX1xUcFHq5X.txt',
    Rust: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/rust-3EUpubpEV8sGn1CKD6i7XRshDUzKvx.txt'
  }
  const file = await fetch(db[language]).then(res => res.text());
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
