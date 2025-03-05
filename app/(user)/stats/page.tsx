import { and, asc, eq, gt } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { getInternalUserId } from "../../server/services/user";
import { scoresTable } from '../../server/db/schema'
import { db } from "../../server/db";
import Link from "next/link"
import { InteractiveGraph, StatCard } from "./components";
import { Keyboard } from 'lucide-react';


const TIME_RANGE_OPTIONS = {
  week: 'week',
  month: 'month',
  all: 'all',
} as const;


type RangeOptionsType = keyof typeof TIME_RANGE_OPTIONS

const getScores = async (clerkUserId: string, timeRange: RangeOptionsType) => {
  "use server"

  const userID = await getInternalUserId(clerkUserId)
  con

  const results = await db
    .select()
    .from(scoresTable)
    .where(and(
      eq(scoresTable.userId, userID),
      gt(
        scoresTable.timestamp,
        new Date(Date.now() - 1000 * 60 * 60 * 24 * (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 1000000))
      )
    ))
    .orderBy(asc(scoresTable.timestamp))

  const formatedDateResults = results.map(item => ({ ...item, date: new Date(item.timestamp).toLocaleDateString() }))

  return formatedDateResults
}

const isValidTimeRange = (timeRange: string | string[] | undefined): RangeOptionsType => {
  return TIME_RANGE_OPTIONS[timeRange as RangeOptionsType] ?? 'week'
}


export default async function StatisticsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const timeRange = isValidTimeRange((await searchParams).timeRange) ?? 'week'
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  const results = await getScores(userId, timeRange)  // Calculate statistics

  const hasData = results.length > 0;

  const averageWpm = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)
  const averageAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
  const bestWpm = Math.max(...results.map(r => r.wpm))
  const bestAccuracy = Math.max(...results.map(r => r.accuracy))

  return !hasData ? (
    <div className="text-center space-y-4">
      <Keyboard size={64} className="mx-auto animate-pulse" />
      <h2 className="text-2xl font-bold">No Typing Data Yet</h2>
      <p className="text-green-500/70 max-w-md mx-auto">
        Start your first typing test to begin tracking your progress. Your statistics and heatmap will appear here.
      </p>
      <Link
        href="/"
        className="inline-block mt-4 px-6 py-3 border-2 border-green-500 rounded-md hover:bg-green-500 hover:text-black transition-colors duration-200"
      >
        Start Typing Test
      </Link>
    </div>
  ) : (
    <div className="flex justify-center w-full">
      <div className="w-full xl:w-1/2 py-8 space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-center space-x-4">
          {(['week', 'month', 'all'] as const).map((range) => (
            <Link href={{ search: `?timeRange=${range}` }}
              key={range}
              className={`px-4 py-2 border-2 border-green-500 rounded-md transition-colors duration-200
                  ${timeRange === range
                  ? 'bg-green-500 text-black'
                  : 'hover:bg-green-500 hover:text-black'}`}

            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-8">
          <StatCard title="Average WPM" value={averageWpm} />
          <StatCard title="Best WPM" value={bestWpm} />
          <StatCard title="Average Accuracy" value={averageAccuracy} suffix="%" />
          <StatCard title="Best Accuracy" value={bestAccuracy} suffix="%" />
        </div>

        {/* Chart */}
        <div className="border-2 border-green-500 rounded-lg p-4 bg-black/50 shadow-retro">
          <InteractiveGraph
            data={results} timeRange={timeRange as string} />
        </div>
      </div>
    </div>
  )


}
