function AccountPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-foreground text-xl">Dompet Saya (Multi-Wallet)</h1>
      <p className="text-sm text-muted-foreground">
        Kelola saldo dari berbagai rekening bank, e-wallet, dan uang fisik Anda.
      </p>

      {/* Wallet list placeholder */}
      <div className="flex flex-col gap-3">
        {["Rekening Bank", "E-Wallet (Gopay)", "Uang Tunai (Cash)", "Tabungan (Savings)"].map((wallet, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
            <span className="font-semibold text-sm text-foreground">{wallet}</span>
            <span className="text-sm text-muted-foreground">Rp --.---.---</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { AccountPage }
