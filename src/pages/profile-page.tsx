function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-foreground text-xl">Profil Pengguna</h1>
      <p className="text-sm text-muted-foreground">
        Lihat detail akun dan atur preferensi aplikasi Anda.
      </p>

      <div className="flex flex-col items-center gap-4 p-6 bg-card border border-border/50 rounded-3xl shadow-sm mt-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cool-mist text-primary text-3xl font-bold">
          LX
        </div>
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-lg text-foreground">Lewin Xander</h2>
          <span className="text-sm text-muted-foreground">lewin.xander@example.com</span>
        </div>
      </div>
    </div>
  )
}

export { ProfilePage }
