"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DailyStat {
  date: string
  dayName: string
  exercises: number
  duration: number
  calories: number
}

interface WeeklyChartProps {
  data: DailyStat[]
  metric: "exercises" | "duration" | "calories"
}

export function WeeklyChart({ data, metric }: WeeklyChartProps) {
  const getMetricLabel = () => {
    switch (metric) {
      case "exercises":
        return "Exercises"
      case "duration":
        return "Minutes"
      case "calories":
        return "Calories"
    }
  }

  const getMetricColor = () => {
    switch (metric) {
      case "exercises":
        return "#3b82f6"
      case "duration":
        return "#10b981"
      case "calories":
        return "#f59e0b"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly {getMetricLabel()}</CardTitle>
        <CardDescription>Your daily {metric} for this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayName" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value} {getMetricLabel().toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey={metric} fill={getMetricColor()} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
