import { useState } from "react"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

// Custom week ranges
const WEEK_RANGES = {
    expenses: "May 1 - May 7",
    income: "May 1 - May 7",
}

const expensesData = [
    { day: "Sun", amount: 65000 },
    { day: "Mon", amount: 95000 },
    { day: "Tue", amount: 45000 },
    { day: "Wed", amount: 85000 },
    { day: "Thu", amount: 80000 },
    { day: "Fri", amount: 110000 }, // Active / Peak day in design
    { day: "Sat", amount: 50000 },
]

const incomeData = [
    { day: "Sun", amount: 0 },
    { day: "Mon", amount: 120000 },
    { day: "Tue", amount: 0 },
    { day: "Wed", amount: 450000 }, // Active / Pay day
    { day: "Thu", amount: 0 },
    { day: "Fri", amount: 150000 },
    { day: "Sat", amount: 0 },
]

const chartConfig: ChartConfig = {
    amount: {
        label: "Nominal",
    },
}

function ReportsPage() {
    const [activeTab, setActiveTab] = useState<string>("expenses")

    const chartData = activeTab === "expenses" ? expensesData : incomeData
    const activeIndex = activeTab === "expenses" ? 5 : 3 // Friday for expenses, Wednesday for income

    return (
        <div className="flex flex-col gap-6">
            {/* Header Title */}
            <div className="flex h-14 items-center justify-center">
                <h1 className="text-base font-semibold text-foreground">
                    Reports
                </h1>
            </div>

            {/* Income / Expense Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1">
                    <TabsTrigger
                        value="income"
                        className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        Income
                    </TabsTrigger>
                    <TabsTrigger
                        value="expenses"
                        className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        Expenses
                    </TabsTrigger>
                </TabsList>

                {/* Chart Card */}
                <div className="mt-6 rounded-xl border border-border/10 bg-secondary/30 p-5 shadow-sm">
                    {/* Card Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                            Chart
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {activeTab === "expenses"
                                ? WEEK_RANGES.expenses
                                : WEEK_RANGES.income}
                        </span>
                    </div>

                    {/* Chart Container */}
                    <div className="h-64 w-full">
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 5,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    className="fill-muted-foreground text-xs font-medium"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tickFormatter={(val) =>
                                        `Rp${val.toLocaleString("id-ID")}`
                                    }
                                    className="fill-muted-foreground text-[10px] font-medium"
                                />
                                <ChartTooltip
                                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="amount"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={32}
                                >
                                    {chartData.map((_, index) => {
                                        const isActive = index === activeIndex
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    isActive
                                                        ? "oklch(0.38 0.06 60)" // --warm-ochre
                                                        : "oklch(0.85 0.01 65)" // --muted-foreground soft
                                                }
                                                className="transition-all duration-300 hover:opacity-80"
                                            />
                                        )
                                    })}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export { ReportsPage }
