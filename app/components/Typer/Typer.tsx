'use client'
import { useState, useEffect, useRef } from 'react'
import { useHeaderStore, useSidebarStore } from '../hooks/hooks'
import { getText } from './server'

export default function Typer() {
  const [text, setText] = useState('')
  const [typedText, setTypedText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wordCount, setWordCount] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const selectedLanguage = useSidebarStore((state) => state.selectedLanguage)
  const intervalRef = useRef(null)
  const containerRef = useRef(null)



  const setLastResult = useHeaderStore((state) => state.setLastResult)

  useEffect(() => {
    async function fetchText() {
      const text = await getText(selectedLanguage)
      setText(text)
    }
    fetchText()
  }, [selectedLanguage]);

  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startTime) / 1000)

        setTimeElapsed(elapsedSec)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isActive, startTime])

  const handleStart = () => {
    setIsActive(true)
    setStartTime(Date.now())
    setTypedText('')
    setWordCount(0)
    setAccuracy(100)
    setTimeElapsed(0)
    if (containerRef.current) containerRef.current.focus()
  }

  const handleKeyDown = (e) => {
    if (!isActive) return

    if (e.key === 'Backspace') {
      setTypedText(prev => prev.slice(0, -1))
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (text[typedText.length] === '\n') {
        setTypedText(prev => prev + '\n')
      }
      return
    }

    if (e.key.length === 1) {
      const newTypedText = typedText + e.key
      setTypedText(newTypedText)

      const words = newTypedText.trim().split(/\s+/)
      setWordCount(words.length)

      const accuracyCount = newTypedText.split('').reduce((acc, char, index) => {
        return text[index] === char ? acc + 1 : acc
      }, 0)
      setAccuracy(Math.round((accuracyCount / newTypedText.length) * 100) || 100)

      if (newTypedText.length === text.length) {
        setIsActive(false)
        setLastResult({ wpm: Math.round((words.length / timeElapsed) * 60), accuracy })
      }
    }
  }

  const wpm = timeElapsed ? Math.round((wordCount / timeElapsed) * 60) : 0

  return (

    <div className="flex-grow flex items-center justify-center p-4">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline z-10"></div>

      <div className="relative z-20 w-full max-w-6xl space-y-6 backdrop-blur-sm bg-black/50 p-8 rounded-lg border-4 border-green-500 shadow-retro">
        <div
          ref={containerRef}
          className="p-4 border-2 border-green-500 rounded-md bg-black/50 shadow-inner-retro focus:outline-none whitespace-pre-wrap text-lg"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={
                typedText[index] === undefined
                  ? 'opacity-50'
                  : typedText[index] === char
                    ? 'text-green-500'
                    : 'text-red-500'
              }
            >
              {char === '\n' ? '↵\n' : char}
            </span>
          ))}
          {typedText.length === text.length ? null : (
            <span className="animate-pulse">|</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleStart}
            disabled={isActive}
            className="px-6 py-3 text-xl font-bold bg-green-500 text-black rounded-md shadow-retro hover:bg-green-400 active:shadow-inner-retro transition-all duration-200 disabled:opacity-50"
          >
            {isActive ? 'Typing...' : 'Start'}
          </button>
          <div className="text-4xl font-bold animate-pulse">{timeElapsed}s</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-lg">
            <span>Progress:</span>
            <span>{Math.round((typedText.length / text.length) * 100)}%</span>
          </div>
          <div className="w-full bg-green-900 rounded-full h-6 shadow-inner-retro">
            <div
              className="bg-green-500 h-6 rounded-full transition-all duration-300 shadow-retro"
              style={{ width: `${(typedText.length / text.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 border-2 border-green-500 rounded-md text-center shadow-retro">
            <div className="text-lg font-medium">WPM</div>
            <div className="text-5xl font-bold animate-pulse">{wpm}</div>
          </div>
          <div className="p-4 border-2 border-green-500 rounded-md text-center shadow-retro">
            <div className="text-lg font-medium">Accuracy</div>
            <div className="text-5xl font-bold animate-pulse">{accuracy}%</div>
          </div>
        </div>
      </div>
    </div>


  )
}
