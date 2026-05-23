/**
 * Formatting numeric nominals into Rupiah format without spaces (e.g., Rp10,000,000).
 */
function formatCurrency(amount: number): string {
    return "Rp" + amount.toLocaleString("id-ID")
}

/**
 * Formatting date strings (including ISO datetime) to a more readable format (e.g., May 5, 09:41).
 */
function formatDate(dateStr: string): string {
    const [datePart, timePart] = dateStr.split("T")
    const parts = datePart.split("-")
    if (parts.length !== 3) return dateStr
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    const day = parseInt(parts[2], 10)
    const monthIdx = parseInt(parts[1], 10) - 1
    
    let formatted = `${monthNames[monthIdx]} ${day}`
    
    if (timePart) {
        const timeParts = timePart.split(":")
        if (timeParts.length >= 2) {
            formatted += `, ${timeParts[0]}:${timeParts[1]}`
        }
    }
    
    return formatted
}

/**
 * Extracts the date key (YYYY-MM-DD) from an ISO datetime string for grouping purposes.
 */
function getDateKey(dateStr: string): string {
    return dateStr.split("T")[0]
}

/**
 * Formatting date string to a readable day label (e.g., "5 May 2024", "Hari ini", "Kemarin").
 */
function formatDateLabel(dateStr: string): string {
    const [datePart] = dateStr.split("T")
    const parts = datePart.split("-")
    if (parts.length !== 3) return dateStr

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    const year = parseInt(parts[0], 10)
    const monthIdx = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)

    const today = new Date()
    const inputDate = new Date(year, monthIdx, day)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const diffDays = Math.round(
        (todayDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return "Hari ini"
    if (diffDays === 1) return "Kemarin"

    return `${day} ${monthNames[monthIdx]} ${year}`
}

/**
 * Formatting time from an ISO datetime string to HH:mm (e.g., "09:41").
 */
function formatTime(dateStr: string): string {
    const [, timePart] = dateStr.split("T")
    if (!timePart) return ""
    const parts = timePart.split(":")
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
    return ""
}

/**
 * Formatting date string to a full readable date (e.g., "May 5 2024").
 */
function formatDateFull(dateStr: string): string {
    const [datePart] = dateStr.split("T")
    const parts = datePart.split("-")
    if (parts.length !== 3) return dateStr

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    const year = parseInt(parts[0], 10)
    const monthIdx = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)

    return `${monthNames[monthIdx]} ${day} ${year}`
}

export { formatCurrency, formatDate, formatDateLabel, formatDateFull, formatTime, getDateKey }
