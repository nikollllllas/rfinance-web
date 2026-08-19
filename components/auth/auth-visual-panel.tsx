import { ArrowUp, Check } from "lucide-react"

export function AuthVisualPanel() {
  return (
    <div
      className="relative hidden min-w-[600px] flex-1 overflow-hidden lg:block"
      style={{
        background:
          "radial-gradient(120% 90% at 85% 8%, oklch(0.24 0.03 250) 0%, oklch(0.15 0.02 255) 45%, oklch(0.1 0.015 255) 100%)",
      }}
    >
      {/* glow orbs */}
      <div className="absolute left-[10%] top-10 h-[420px] w-[420px] rounded-full bg-success opacity-20 blur-[90px]" />
      <div className="absolute left-[42%] top-[520px] h-[360px] w-[360px] rounded-full bg-warning opacity-10 blur-[100px]" />

      {/* dot grid texture */}
      <svg className="absolute inset-0 h-full w-full opacity-35">
        <defs>
          <pattern id="rf-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="oklch(0.4 0.02 250)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rf-dots)" />
      </svg>

      {/* concentric rings, top-right */}
      <svg
        className="absolute -right-40 -top-36 opacity-50"
        width="520"
        height="520"
        viewBox="0 0 520 520"
        fill="none"
      >
        <circle cx="260" cy="260" r="100" stroke="white" strokeOpacity="0.08" />
        <circle cx="260" cy="260" r="160" stroke="white" strokeOpacity="0.06" />
        <circle cx="260" cy="260" r="220" className="stroke-success" strokeOpacity="0.1" />
      </svg>

      {/* ghost brand mark, bottom-right */}
      <svg className="absolute -bottom-16 -right-12 opacity-5" width="260" height="260" viewBox="0 0 260 260" fill="none">
        <rect x="10" y="10" width="240" height="240" rx="56" stroke="white" strokeWidth="10" />
        <path d="M130 10 V250" stroke="white" strokeWidth="10" />
      </svg>

      {/* card: saldo total */}
      <div className="absolute left-[13%] top-[190px] w-[236px] -rotate-3 rounded-2xl border border-white/10 bg-[oklch(0.3_0.02_255/0.55)] p-5 shadow-[0_20px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <p className="mb-2 text-xs font-medium text-white/70">Saldo total</p>
        <p className="font-display mb-2.5 text-[26px] font-semibold tracking-tight text-white">R$ 24.850,00</p>
        <div className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-1">
          <ArrowUp className="h-3 w-3 text-success" strokeWidth={3} />
          <span className="text-[11.5px] font-semibold text-success">12,4% este mês</span>
        </div>
      </div>

      {/* pill: highlight */}
      <div className="absolute left-[44%] top-[300px] -rotate-2 rounded-full border border-white/10 bg-[oklch(0.3_0.02_255/0.65)] px-3 py-1.5 shadow-[0_10px_24px_-10px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <ArrowUp className="h-3 w-3 text-success" strokeWidth={3} />
          <span className="text-xs font-semibold text-white">+ R$ 450,00 este mês</span>
        </div>
      </div>

      {/* pill: goal */}
      <div className="absolute left-[60%] top-[235px] rotate-3 rounded-full border border-white/10 bg-[oklch(0.3_0.02_255/0.65)] px-3 py-1.5 shadow-[0_10px_24px_-10px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Check className="h-3 w-3 text-warning" strokeWidth={3} />
          <span className="text-xs font-semibold text-white">Meta do mês batida</span>
        </div>
      </div>

      {/* card: por categoria (donut) */}
      <div className="absolute right-[6%] top-[70px] w-[196px] rotate-2 rounded-2xl border border-white/10 bg-[oklch(0.3_0.02_255/0.55)] p-[18px] shadow-[0_20px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <p className="mb-3.5 text-xs font-medium text-white/70">Por categoria</p>
        <div className="flex items-center gap-3.5">
          <svg width="72" height="72" viewBox="0 0 100 100" className="-rotate-90 flex-shrink-0">
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className="stroke-success"
              strokeWidth="12"
              strokeDasharray="110.8 263.9"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className="stroke-warning"
              strokeWidth="12"
              strokeDasharray="87.1 263.9"
              strokeDashoffset="-110.8"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[11.5px] text-white">Moradia 42%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="text-[11.5px] text-white">Alimentação 33%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="text-[11.5px] text-white">Outros 25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* card: metas do mês */}
      <div className="absolute right-[6%] top-[300px] w-[220px] -rotate-1 rounded-2xl border border-white/10 bg-[oklch(0.3_0.02_255/0.55)] p-5 shadow-[0_20px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <p className="mb-3.5 text-xs font-medium text-white/70">Metas do mês</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Alimentação", value: 72, tone: "bg-success" },
            { label: "Transporte", value: 45, tone: "bg-success" },
            { label: "Lazer", value: 88, tone: "bg-warning" },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex justify-between">
                <span className="text-[11.5px] text-white">{row.label}</span>
                <span className="text-[11.5px] text-white/70">{row.value}%</span>
              </div>
              <div className="h-[5px] rounded-full bg-white/10">
                <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${row.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* chart */}
      <div className="absolute left-[6%] top-[460px] w-[58%] min-w-[420px]">
        <svg className="block w-full overflow-visible" viewBox="0 0 700 360" fill="none">
          <defs>
            <linearGradient id="rf-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="[stop-color:oklch(0.75_0.17_165)]" stopOpacity="0.35" />
              <stop offset="100%" className="[stop-color:oklch(0.75_0.17_165)]" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,260 C60,240 100,180 160,190 C220,200 260,120 330,110 C400,100 440,150 500,120 C560,90 600,40 700,20 L700,360 L0,360 Z"
            fill="url(#rf-area-fill)"
          />
          <path
            d="M0,260 C60,240 100,180 160,190 C220,200 260,120 330,110 C400,100 440,150 500,120 C560,90 600,40 700,20"
            className="stroke-success"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="700" cy="20" r="5" className="fill-success" />
          <circle cx="700" cy="20" r="9" className="fill-success" opacity="0.3" />
        </svg>
        <div className="mt-2.5 flex justify-between px-1">
          {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((month) => (
            <span key={month} className="text-[11px] text-white/40">
              {month}
            </span>
          ))}
        </div>
      </div>

      {/* card: economizado */}
      <div className="absolute left-[30%] top-[590px] w-[208px] rotate-2 rounded-2xl border border-white/10 bg-[oklch(0.3_0.02_255/0.55)] p-4 shadow-[0_20px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-md">
        <p className="mb-1.5 text-xs font-medium text-white/70">Economizado</p>
        <p className="font-display text-xl font-semibold text-white">R$ 1.230,00</p>
      </div>

      {/* tagline */}
      <div className="absolute bottom-16 left-[8%] w-[560px]">
        <p className="font-display text-[22px] font-medium leading-[1.3] tracking-tight text-white">
          Clareza financeira,
          <br />
          todos os dias.
        </p>
      </div>
    </div>
  )
}
