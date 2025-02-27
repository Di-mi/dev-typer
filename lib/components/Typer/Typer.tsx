'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useHeaderStore, useSidebarStore } from 'lib/hooks/hooks'
import { SUPPORTED_LANGUAGES_TYPE } from 'lib/common/types'

const sampleTextFromList = (listOfLines: string[], listOfRands: number[]) => {
  const textSample = []
  for (let i = 0; i < 5; i++) {
    textSample.push(listOfLines[Math.round(listOfRands[i] * (listOfLines.length - 1))]);
  }

  return textSample.join('\n')
}


export default function Typer({ textByLanguage, randomSeed }: { textByLanguage: Record<SUPPORTED_LANGUAGES_TYPE, string[]>, randomSeed: number[] }) {

  const [typedText, setTypedText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [accuracy, setAccuracy] = useState(100)
  const [isActive, setIsActive] = useState(false)

  const activeRef = useRef(isActive)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const selectedLanguage = useSidebarStore((state) => state.selectedLanguage)
  const [text, setText] = useState(sampleTextFromList(textByLanguage[selectedLanguage], randomSeed))
  const intervalRef = useRef(null)
  const containerRef = useRef(null)
  const typedTextRef = useRef(typedText)

  const setLastResult = useHeaderStore((state) => state.setLastResult)
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [text])

  useEffect(() => {
    activeRef.current = isActive
  }, [isActive])

  useEffect(() => {
    async function fetchText() {
      const listOfLines = textByLanguage[selectedLanguage];

      setText(sampleTextFromList(listOfLines, randomSeed))
      setTypedText('')
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
    setAccuracy(100)
    setTimeElapsed(0)
    if (containerRef.current) containerRef.current.focus()
  }

  useEffect(() => {
    typedTextRef.current = typedText
    const accuracyCount = typedText.split('').reduce((acc, char, index) => {
      return text[index] === char ? acc + 1 : acc
    }, 0)
    setAccuracy(Math.round((accuracyCount / typedText.length) * 100) || 100)

    if (typedText.length === text.length) {
      setIsActive(false)
      setLastResult({
        wpm: Math.round((
          (typedText.length / 5) / timeElapsed) * 60),
        accuracy
      })
    }
  }, [typedText])

  const handleKeyDown = (e) => {
    if (!activeRef.current) {
      handleStart()
    }
    if (e.key === 'Backspace') {
      setTypedText(typedTextRef.current.slice(0, -1))
      return
    }

    if (e.key === 'Shift') {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (text[typedTextRef.current.length] === '\n') {
        setTypedText(typedTextRef.current + '\n')
      }
      return
    }

    if (e.key.length === 1) {
      setTypedText(typedTextRef.current + e.key)
    }
  }

  const wpm = timeElapsed ? Math.round(
    ((typedTextRef.current.length/5) / timeElapsed) * 60) : 0

  return (
    <div className="flex-grow flex items-center justify-center p-4 my-auto" >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline z-10"></div>

      <div className="relative z-20 w-full max-w-6xl space-y-6 backdrop-blur-sm bg-black/50 p-8 rounded-lg border-4 border-green-500 shadow-retro" suppressHydrationWarning>
        <div
          ref={containerRef}
          className="p-4 border-2 border-green-500 rounded-md bg-black/50 shadow-inner-retro focus:outline-none whitespace-pre-wrap text-lg"
          tabIndex={0}
        >
          {
            typedText.split('').map((char, index) => {
              let charToPrint = char
              if (typedText[index] != text[index]) {
                charToPrint = text[index]
              }
              return (
                <span
                  key={index}
                  className={
                    typedText[index] === text[index]
                      ? 'text-green-500'
                      : 'text-red-500'
                  } suppressHydrationWarning>
                  {charToPrint === '\n' ? '↵\n' : charToPrint}
                </span>
              )
            })
          }
          <span className="animate-pulse">⎹</span>

          {text.slice(typedText ? typedText.length : 0).split('').map((char, index) => (
            <span
              key={index}
              className={'opacity-50'}
              suppressHydrationWarning
            >
              {char === '\n' ? '↵\n' : char}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span>
           {isActive ? 'Typing...' : ''}
          </span>
          <div className="text-4xl font-bold animate-pulse">{timeElapsed}s</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-lg">
            <span>Progress:</span>
            <span>{text.length ? (Math.round(typedText.length / text.length) * 100) : 0}%</span>
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
