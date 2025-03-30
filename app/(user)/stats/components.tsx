"use client"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";



export function InteractiveGraph({ data }: { data: any[]; timeRange: string }) {
  return (
    <ChartContainer
      config={{
        wpm: {
          label: "WPM",
          color: "var(--chart-1)",
        },
        accuracy: {
          label: "Accuracy",
          color: "var(--chart-2)",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.2}
          />
          <XAxis
            dataKey="date"
            stroke="var(--border)"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            yAxisId="wpm"
            stroke="var(--chart-1)"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            yAxisId="accuracy"
            orientation="right"
            stroke="var(--chart-2)"
            fontSize={12}
            tickMargin={10}
            domain={[0, 100]}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload) return null
              return (
                <div className="rounded-lg border-2 border-green-500 bg-black p-2 shadow-retro">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-green-500">WPM</span>
                      <span className="font-bold text-green-500">
                        {payload[0]?.value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-green-500">Accuracy</span>
                      <span className="font-bold text-green-500">
                        {payload[1]?.value}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-500">
                    {payload[0]?.payload.date}
                  </div>
                </div>
              )
            }}
          />
          <Line
            yAxisId="wpm"
            type="monotone"
            dataKey="wpm"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "var(--chart-1)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--chart-1)",
              strokeWidth: 2,
              className: "animate-pulse",
            }}
          />
          <Line
            yAxisId="accuracy"
            type="monotone"
            dataKey="accuracy"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "var(--chart-2)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--chart-2)",
              strokeWidth: 2,
              className: "animate-pulse",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


export function KeyboardHeatmap({
  mistakes,
  mistakesPercentage,
}: {
  mistakes: Record<string, number>
  mistakesPercentage: Record<string, number>
}) {
  const layout = [
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ]

  // Map for translating shift symbols back to their base keys for data lookup
  const shiftKeyMap: Record<string, string> = {
    "!": "1",
    "@": "2",
    "#": "3",
    $: "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    _: "-",
    "+": "=",
  }


  const getMistakeRate = (key: string) => {
    // For shift symbols, look up the base key
    const dataKey = shiftKeyMap[key] || key
    return mistakesPercentage[dataKey] || 0
  }

  const getHeatColor = (rate: number) => {
    const intensity = Math.min(rate * 2, 100) / 100
    return `rgba(255, ${Math.round(255 * (1 - intensity))}, 0, ${0.3 + intensity * 0.7})`
  }

  const [tooltipContent, setTooltipContent] = useState<{ key: string; content: string, x: number, y: number } | null>(null)
  const tooltipRef = useRef<{ key: string; content: string, x: number, y: number } | null>(null)

  const getKeyDisplay = (key: string) => {
    if (key === "enter") return <CornerDownLeft size={20} />
    if (key === "\\") return "\\"
    return key
  }

  useEffect(() => {
    tooltipRef.current = tooltipContent
  }, [tooltipContent])

  const getKeyWidth = (key: string) => {
    if (key === "enter") return "w-24 sm:w-28"
    return "w-12 h-12 sm:w-14 sm:h-14"
  }

  const getTooltipText = (key: string) => {
    // For shift symbols, show both the symbol and the base key
    if (shiftKeyMap[key]) {
      return `${key} (SHIFT+${shiftKeyMap[key]})`
    }
    return key === "enter" ? "ENTER" : key.toUpperCase()
  }

  return (
    <div className="relative p-6 border-2 border-green-500 rounded-md bg-black/50 shadow-retro">
      <div className="text-sm mb-6 font-bold">Mistake Heatmap</div>
      <div className="flex flex-col items-center gap-4">
        {/* Top row with extra spacing */}
        <div className="flex gap-1 mb-4">
          {layout[0].map((key) => {
            const dataKey = shiftKeyMap[key] || key
            const mistakeRate = getMistakeRate(key)
            const totalHits = Math.round(mistakes[dataKey] * (100 / mistakesPercentage[dataKey]) || 0)
            const totalMistakes = mistakes[dataKey] || 0
            return (
              <div
                key={key}
                className={`${getKeyWidth(key)} border-2 border-green-500 rounded flex items-center justify-center transition-all hover:border-green-400 relative text-sm sm:text-base`}
                style={{ backgroundColor: getHeatColor(mistakeRate) }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setTooltipContent({
                    key,
                    content: `${getTooltipText(key)}
Mistake Rate: ${mistakeRate.toFixed(1)}%
Total Strokes: ${totalHits}
Total Mistakes: ${totalMistakes}`,
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                  })
                }}
                onMouseLeave={() => {
                  // Add a small delay to prevent flickering
                  setTimeout(() => {
                    if (tooltipContent?.key === key) {
                      setTooltipContent(null)
                    }
                  }, 100)
                }}
              >
                {getKeyDisplay(key)}
              </div>
            )
          })}
        </div>

        {/* Main keyboard rows */}
        {layout.slice(1).map((row, i) => (
          <div key={i} className="flex gap-1" style={{ marginLeft: i === 0 ? 12 : i === 1 ? 16 : 24 }}>
            {row.map((key) => {
              const dataKey = shiftKeyMap[key] || key
              const mistakeRate = getMistakeRate(key)
              const totalHits = Math.round(mistakes[dataKey] * (100 / mistakesPercentage[dataKey]) || 0)
              const totalMistakes = mistakes[dataKey] || 0
              return (
                <div
                  key={key}
                  className={`${getKeyWidth(key)} border-2 border-green-500 rounded flex items-center justify-center transition-all hover:border-green-400 relative text-sm sm:text-base`}
                  style={{ backgroundColor: getHeatColor(mistakeRate) }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltipContent({
                      key,
                      content: `${getTooltipText(key)}
Mistake Rate: ${mistakeRate.toFixed(1)}%
Total Strokes: ${totalHits}
Total Mistakes: ${totalMistakes}`,
                      x: rect.left + window.scrollX,
                      y: rect.top + window.scrollY,
                    })
                  }}
                  onMouseLeave={() => {
                    // Add a small delay to prevent flickering
                    setTimeout(() => {
                      if (tooltipRef.current?.key === key) {
                        setTooltipContent(null)
                      }
                    }, 100)
                  }}
                >
                  {getKeyDisplay(key)}
                </div>
              )
            })}
          </div>
        ))}

        {/* Space bar row with extra spacing */}
        <div className="flex gap-1 mt-4">
          <div
            className="w-80 sm:w-[28rem] h-12 sm:h-14 border-2 border-green-500 rounded flex items-center justify-center transition-all hover:border-green-400 relative text-sm sm:text-base"
            style={{ backgroundColor: getHeatColor(getMistakeRate("space")) }}
            onMouseEnter={(e) => {
              const mistakeRate = getMistakeRate(" ")
              const totalHits = Math.round(mistakes[" "] * (100 / mistakesPercentage[" "]) || 0)
              const totalMistakes = mistakes[" "] || 0
              const rect = e.currentTarget.getBoundingClientRect()
              setTooltipContent({
                key: "space",
                content: `SPACE
Mistake Rate: ${mistakeRate.toFixed(1)}%
Total Strokes: ${totalHits}
Total Mistakes: ${totalMistakes}`,
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
              })

            }}
            onMouseLeave={() => {
              setTimeout(() => {
                if (tooltipRef.current?.key === "space") {
                  setTooltipContent(null)
                }
              }, 100)
            }}
          >
            SPACE
          </div>
        </div>
      </div>
      {tooltipContent && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-black border-2 border-green-500 rounded-md shadow-retro whitespace-pre pointer-events-none"
          style={{
            left: `${tooltipContent.x ?? 0}px`,
            top: `${(tooltipContent.y) - 100}px`,
            pointerEvents: "none",
          }}
        >
          {tooltipContent.content}
        </div>
      )}
    </div>
  )
}
export const StatCard = ({ title, value, suffix = '' }: { title: string, value: string | number, suffix?: string }) => {
  return (
    <div className="p-2 border-2 border-green-500 rounded-md bg-black/50 shadow-retro" >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}{suffix}</div>
    </div >
  )
}


