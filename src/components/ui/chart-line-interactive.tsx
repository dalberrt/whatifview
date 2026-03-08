"use client"

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

export function ChartLineInteractive({ data, ticker }: { data: any; ticker: string[] }) {

  const chartConfig: ChartConfig = {
  }

  ticker.forEach((t, i) => {
    if (t) chartConfig[t] = { label: t, color: `var(--chart-${i + 1})` }
  })

  const dateRange = data
    ? `${data[0]?.date ?? ''} → ${data.at(-1)?.date ?? ''}`
    : null

  return (
    <Card className="w-full">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              {ticker.length > 0 ? ticker.join(' vs ') : 'Portfolio value over time'}
            </CardTitle>
            {dateRange && (
              <CardDescription className="mt-0.5">{dateRange}</CardDescription>
            )}
          </div>
          {/* Legend dots */}
          <div className="flex flex-wrap gap-3">
            {ticker.map((t, i) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: `var(--chart-${i + 1})` }}
                />
                {t}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8, top: 4, bottom: 4 }}
          >
            <CartesianGrid vertical={false} className="stroke-border/50" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v: number) =>
                `$${Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`
              }
              width={56}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[170px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />

            {/* One line per ticker */}
            {ticker.map((t) => (
              <Line
                key={t}
                dataKey={t}
                type="monotone"
                stroke={`var(--color-${t})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
