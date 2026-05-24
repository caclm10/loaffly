import { useState, useMemo, useEffect } from "react"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import { useLiveQuery } from "dexie-react-hooks"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig: ChartConfig = {
    amount: {
        label: "Nominal",
    },
}

function ReportsPage() {
    const [activeTab, setActiveTab] = useState<string>("expenses")

    // 1. Fetch all transactions reactively
    const transactions = useLiveQuery(() => db.transactions.toArray())

    // 2. State for the selected week's reference date
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // 3. Initialize selectedDate from the latest transaction date once loaded
    useEffect(() => {
        if (transactions && transactions.length > 0 && !selectedDate) {
            // Find transaction with the latest date to determine the active reference week
            const latestTx = [...transactions].sort((a, b) => b.date.localeCompare(a.date))[0]
            if (latestTx) {
                const [datePart] = latestTx.date.split("T")
                const parts = datePart.split("-")
                if (parts.length === 3) {
                    setSelectedDate(new Date(
                        parseInt(parts[0], 10),
                        parseInt(parts[1], 10) - 1,
                        parseInt(parts[2], 10)
                    ))
                }
            }
        } else if (transactions && transactions.length === 0 && !selectedDate) {
            setSelectedDate(new Date())
        }
    }, [transactions, selectedDate])

    // 4. Compute reference date, week range, and chart data based on active tab
    const reportsData = useMemo(() => {
        const refDate = selectedDate || new Date()

        // Sunday is start of week
        const dayOfWeek = refDate.getDay()
        const sunday = new Date(refDate)
        sunday.setDate(refDate.getDate() - dayOfWeek)

        const saturday = new Date(refDate)
        saturday.setDate(refDate.getDate() + (6 - dayOfWeek))

        // Format dates as YYYY-MM-DD
        const toDateStr = (d: Date) => {
            const yyyy = d.getFullYear()
            const mm = String(d.getMonth() + 1).padStart(2, "0")
            const dd = String(d.getDate()).padStart(2, "0")
            return `${yyyy}-${mm}-${dd}`
        }

        const sundayStr = toDateStr(sunday)
        const saturdayStr = toDateStr(saturday)

        // Generate Week Range Label (e.g., "May 4 - May 10 2024")
        const standardMonths = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        const startMonth = standardMonths[sunday.getMonth()]
        const startDay = sunday.getDate()
        const endMonth = standardMonths[saturday.getMonth()]
        const endDay = saturday.getDate()
        const year = refDate.getFullYear()

        let rangeLabel = ""
        if (startMonth === endMonth) {
            rangeLabel = `${startMonth} ${startDay} - ${endDay}, ${year}`
        } else {
            rangeLabel = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
        }

        // Initialize 7 days data (Sun to Sat)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const expensesChart = days.map((day) => ({ day, amount: 0 }))
        const incomeChart = days.map((day) => ({ day, amount: 0 }))

        // Filter and aggregate transactions in this week
        if (transactions) {
            for (const t of transactions) {
                const [tDatePart] = t.date.split("T")
                if (tDatePart >= sundayStr && tDatePart <= saturdayStr) {
                    const parts = tDatePart.split("-")
                    if (parts.length === 3) {
                        const tDate = new Date(
                            parseInt(parts[0], 10),
                            parseInt(parts[1], 10) - 1,
                            parseInt(parts[2], 10)
                        )
                        const dayIdx = tDate.getDay()
                        if (dayIdx >= 0 && dayIdx <= 6) {
                            if (t.type === "expense") {
                                expensesChart[dayIdx].amount += t.amount
                            } else if (t.type === "income") {
                                incomeChart[dayIdx].amount += t.amount
                            }
                        }
                    }
                }
            }
        }

        return {
            rangeLabel,
            expenses: expensesChart,
            income: incomeChart,
        }
    }, [transactions, selectedDate])

    const chartData = activeTab === "expenses" ? reportsData.expenses : reportsData.income

    // Dynamically calculate the active peak day (the bar with the largest amount > 0)
    const activeIndex = useMemo(() => {
        let maxIndex = -1
        let maxAmount = 0
        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].amount > maxAmount) {
                maxAmount = chartData[i].amount
                maxIndex = i
            }
        }
        return maxIndex
    }, [chartData])

    const handlePrevWeek = () => {
        setSelectedDate((prev) => {
            const d = prev ? new Date(prev) : new Date()
            d.setDate(d.getDate() - 7)
            return d
        })
    }

    const handleNextWeek = () => {
        setSelectedDate((prev) => {
            const d = prev ? new Date(prev) : new Date()
            d.setDate(d.getDate() + 7)
            return d
        })
    }

    const isLoading = !transactions

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
                        <span className="text-xs font-semibold text-foreground">
                            Weekly Overview
                        </span>

                        {/* Dynamic Week Navigator */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handlePrevWeek}
                                className="flex size-6 items-center justify-center rounded-full hover:bg-secondary active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                                aria-label="Previous week"
                                disabled={isLoading}
                            >
                                <ChevronLeftIcon className="size-4" />
                            </button>
                            <span className="text-xs font-semibold text-muted-foreground px-1 select-none">
                                {isLoading ? "Loading..." : reportsData.rangeLabel}
                            </span>
                            <button
                                onClick={handleNextWeek}
                                className="flex size-6 items-center justify-center rounded-full hover:bg-secondary active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                                aria-label="Next week"
                                disabled={isLoading}
                            >
                                <ChevronRightIcon className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-64 w-full">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground animate-pulse">
                                Loading reports...
                            </div>
                        ) : (
                            <ChartContainer
                                config={chartConfig}
                                className="h-full w-full"
                            >
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 5,
                                        left: 0,
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
                                        width={38}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={6}
                                        tickFormatter={(val) => {
                                            if (val >= 1000000) {
                                                return `${(val / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
                                            }
                                            if (val >= 1000) {
                                                return `${(val / 1000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}rb`
                                            }
                                            return `${val}`
                                        }}
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
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export { ReportsPage }
