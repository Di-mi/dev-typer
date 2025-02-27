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



export const StatCard = ({ title, value, suffix = '' }: { title: string, value: number, suffix?: string }) => {
  return (
    <div className="p-4 border-2 border-green-500 rounded-md bg-black/50 shadow-retro" >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}{suffix}</div>
    </div >
  )
}


