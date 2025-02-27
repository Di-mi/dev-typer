"use server"
import { SUPPORTED_LANGUAGES_TYPE } from "lib/common/types";
import { unstable_cache } from "next/cache";



async function retrieveTextFromDb(language: SUPPORTED_LANGUAGES_TYPE) {
  const db = {
    JavaScript: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/typescript-KKDE6rGkQ28yKVtQ1DXHUxNa04AfZK.txt',
    Python: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/python-46Hk3ESFtISTrzb4GLDtX1xUcFHq5X.txt',
    Rust: 'https://7wdqxxyilxdytklh.public.blob.vercel-storage.com/data/rust-3EUpubpEV8sGn1CKD6i7XRshDUzKvx.txt'
  }
  const file = await fetch(db[language]).then(res => res.text());
  const textList = file.split('\n');
  return textList;
}




export async function getAllTextByLanguage(selectedLanguage: SUPPORTED_LANGUAGES_TYPE = 'JavaScript'): Promise<string[]>{
  return unstable_cache(async () => {return await retrieveTextFromDb(selectedLanguage)}, ['languages'], {revalidate: 1000})();
}
