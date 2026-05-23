function ReportsPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-foreground">
                Laporan Keuangan
            </h1>
            <p className="text-sm text-muted-foreground">
                Halaman statistik dan analisis pengeluaran Anda akan muncul di
                sini.
            </p>

            {/* Visual Chart Placeholder */}
            <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-dashed border-border/80 bg-secondary/30 p-6 text-muted-foreground">
                <span className="text-sm">
                    Analisis Visual Pengeluaran (Segera Hadir)
                </span>
            </div>
        </div>
    )
}

export { ReportsPage }
