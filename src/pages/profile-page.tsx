function ProfilePage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-foreground">
                Profil Pengguna
            </h1>
            <p className="text-sm text-muted-foreground">
                Lihat detail akun dan atur preferensi aplikasi Anda.
            </p>

            <div className="mt-4 flex flex-col items-center gap-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cool-mist text-3xl font-bold text-primary">
                    LX
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold text-foreground">
                        Lewin Xander
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        lewin.xander@example.com
                    </span>
                </div>
            </div>
        </div>
    )
}

export { ProfilePage }
