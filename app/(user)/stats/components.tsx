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
import { useState } from "react";



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
  mistakesCounts,
  mistakesPercentages,
}: {
  mistakesCounts: Record<string, number>
  mistakesPercentages: Record<string, number>
}) {
  const layout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ]

  const getHeatColor = (rate: number) => {
    const intensity = Math.min(rate * 2, 100) / 100
    return `rgba(255, ${Math.round(255 * (1 - intensity))}, 0, ${0.3 + intensity * 0.7})`
  }

  const [tooltipContent, setTooltipContent] = useState<{ content: string; x: number; y: number } | null>(null)

  return (
    <div className="relative p-4 border-2 border-green-500 rounded-md bg-black/50 shadow-retro">
      <div className="text-sm mb-4 font-bold">Mistake Heatmap</div>
      <div className="flex flex-col items-center gap-2">
        {layout.map((row, i) => (
          <div key={i} className="flex gap-1" style={{ marginLeft: i * 12 }}>
            {row.map((key) => {
              const mistakeRate = mistakesPercentages[key] || 0
              const totalHits = Math.round(mistakesCounts[key] * (100 / mistakesPercentages[key])) || 0
              const totalMistakes = mistakesCounts[key] || 0
              return (
                <div
                  key={key}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-green-500 rounded flex items-center justify-center transition-all hover:border-green-400 relative"
                  style={{ backgroundColor: getHeatColor(mistakeRate) }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltipContent({
                      content: `${key.toUpperCase()}
Mistake Rate: ${mistakeRate.toFixed(1)}%
Total Strokes: ${totalHits}
Total Mistakes: ${totalMistakes}`,
                      x: rect.left + window.scrollX,
                      y: rect.top + window.scrollY,
                    })
                  }}
                  onMouseLeave={() => setTooltipContent(null)}
                >
                  {key.toUpperCase()}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {tooltipContent && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-black border-2 border-green-500 rounded-md shadow-retro whitespace-pre"
          style={{
            left: `${tooltipContent.x}px`,
            top: `${tooltipContent.y - 80}px`,
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


