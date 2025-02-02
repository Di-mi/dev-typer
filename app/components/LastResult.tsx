"use client"
import { useHeaderStore } from "./hooks/hooks"


const LastResult = () => {
  const lastResult = useHeaderStore((state) => state.lastResult)
  return lastResult && (<>
      <div className="text-sm">
        Last: {lastResult.wpm} WPM / {lastResult.accuracy}% Accuracy
      </div>
    </>)
}

export default LastResult
