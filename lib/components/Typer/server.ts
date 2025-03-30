"use server"
import { recordScore } from "app/server/services/score";
import { getInternalUserId } from "app/server/services/user";
import { SUPPORTED_LANGUAGES_TYPE } from "lib/common/types";
import { revalidatePath, unstable_cache } from "next/cache";



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


function calculateMistakes(assignmentText: string, typedText: string) {
  const mistakesCounts = {};
  const mistakesPercentage = {};

  const assignmentTextArray = assignmentText.split('');
  const typedTextArray = typedText.split('');

  const charCounts = assignmentTextArray.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < assignmentTextArray.length; i++) {
    if (assignmentTextArray[i] !== typedTextArray[i]) {
      mistakesCounts[assignmentTextArray[i]] = (mistakesCounts[assignmentTextArray[i]] || 0) + 1;
      mistakesPercentage[assignmentTextArray[i]] = (mistakesCounts[assignmentTextArray[i]] / charCounts[assignmentTextArray[i]]) * 100;
    }
  }
  return [mistakesCounts, mistakesPercentage];

}

export async function scoreTyping(score: { wpm: number, accuracy: number, assigmentText: string, typedText: string, clerkId: string, scoreLanguage: SUPPORTED_LANGUAGES_TYPE }) {
  // Record score in db
  const userId = await getInternalUserId(score.clerkId);

  const [mistakesCounts, mistakesPercentage] = calculateMistakes(score.assigmentText, score.typedText);

  await recordScore({
    wpm: score.wpm,
    accuracy: score.accuracy, userId,
    assigmentText: score.assigmentText,
    typedText: score.typedText,
    mistakesPercentage: JSON.stringify(mistakesPercentage),
    mistakesCounts: JSON.stringify(mistakesCounts),
    language: score.scoreLanguage
  });

}


export async function getAllTextByLanguage(selectedLanguage: SUPPORTED_LANGUAGES_TYPE = 'JavaScript'): Promise<string[]> {
  return unstable_cache(async () => { return await retrieveTextFromDb(selectedLanguage) }, ['languages'], { revalidate: 1000 })();
}

export async function reloadText() {
  revalidatePath('/');

}
