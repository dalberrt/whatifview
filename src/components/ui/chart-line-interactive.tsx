"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const chartConfig = {
  views: {
    label: "Price Value",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  car: {
    label: "Car",
    color: "var(--chart-3)",
  }
} satisfies ChartConfig

export function ChartLineInteractive({data, ticker}) {

  const [activeChart] =
    React.useState<keyof typeof chartConfig>("desktop")

  const [activeChart2] =
    React.useState<keyof typeof chartConfig>("mobile")

  const [activeChart3] =
    React.useState<keyof typeof chartConfig>("car")

  return (
    <Card className="mx-auto w-full md:w-[70vw] py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-[40px] sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{ticker.toUpperCase()}</CardTitle>
          {data &&
            <CardDescription>
            Showing value increase from {data[0]["date"]} to {data.at(-1)["date"]}
          </CardDescription>
          }
          
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8}
              
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={activeChart2}
              type="monotone"
              stroke={`var(--color-${activeChart2})`}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={activeChart3}
              type="monotone"
              stroke={`var(--color-${activeChart3})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
