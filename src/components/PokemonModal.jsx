import { useEffect, useState, useRef } from "react";
import { TYPE_META } from "../App";

const STAT_META = {
  hp: { label: "HP", color: "#f87171" },
  attack: { label: "Atk", color: "#fb923c" },
  defense: { label: "Def", color: "#60a5fa" },
  "special-attack": { label: "Sp.Atk", color: "#c084fc" },
  "special-defense": { label: "Sp.Def", color: "#34d399" },
  speed: { label: "Spd", color: "#facc15" },
};

const TABS = ["stats", "abilities", "sprites"];

const artwork = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export default function PokemonModal({ url, onClose }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("stats");
  const backdropRef = useRef(null);

  useEffect(() => {
    setData(null);
    setTab("stats");
    fetch(url)
      .then((r) => r.json())
      .then(setData);
  }, [url]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const primaryHex = TYPE_META[data?.types?.[0]?.type?.name]?.hex ?? "#6366f1";
  const total = data?.stats.reduce((a, s) => a + s.base_stat, 0) ?? 0;

  return (
    /* Backdrop */
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      {/* Sheet */}
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: "88vh",
          animation: "rise .25s cubic-bezier(.34,1.3,.64,1)",
        }}
      >
        {/* Hero */}
        <div
          className="relative flex flex-col items-center px-6 pt-6 pb-4 shrink-0"
          style={{ background: `${primaryHex}18` }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-100 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {!data ? (
            /* Spinner */
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-[11px] font-bold text-slate-400 mb-1">
                #{String(data.id).padStart(3, "0")}
              </p>

              <img
                src={artwork(data.id)}
                alt={data.name}
                className="w-36 h-36 object-contain"
                style={{
                  filter: `drop-shadow(0 8px 20px ${primaryHex}55)`,
                  animation: "pop .35s cubic-bezier(.34,1.4,.64,1) .05s both",
                }}
              />

              <h2 className="mt-3 text-2xl font-black capitalize tracking-tight text-slate-900">
                {data.name}
              </h2>

              {/* Type pills */}
              <div className="flex gap-2 mt-2">
                {data.types.map((t) => {
                  const h = TYPE_META[t.type.name]?.hex ?? "#888";
                  return (
                    <span
                      key={t.type.name}
                      className="text-xs font-bold px-3 py-1 rounded-full text-white capitalize"
                      style={{ background: h }}
                    >
                      {t.type.name}
                    </span>
                  );
                })}
              </div>

              {/* Quick stats bar */}
              <div className="mt-4 w-full flex rounded-2xl bg-white/70 border border-white divide-x divide-slate-100 overflow-hidden">
                {[
                  {
                    val: `${(data.height / 10).toFixed(1)} m`,
                    label: "Height",
                  },
                  {
                    val: `${(data.weight / 10).toFixed(1)} kg`,
                    label: "Weight",
                  },
                  { val: data.base_experience ?? "—", label: "Base XP" },
                ].map(({ val, label }) => (
                  <div
                    key={label}
                    className="flex-1 flex flex-col items-center py-2.5"
                  >
                    <span className="text-base font-black text-slate-800 leading-none">
                      {val}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        {data && (
          <>
            <div className="flex gap-0.5 px-4 pt-3 shrink-0">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-xs font-bold capitalize rounded-xl transition-all duration-150"
                  style={
                    tab === t
                      ? { background: primaryHex, color: "#fff" }
                      : { color: "#94a3b8" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div
              className="overflow-y-auto flex-1 px-5 py-4"
              style={{ scrollbarWidth: "thin" }}
            >
              {tab === "stats" && (
                <div className="space-y-3">
                  {data.stats.map((s) => {
                    const m = STAT_META[s.stat.name] ?? {
                      label: s.stat.name,
                      color: "#888",
                    };
                    const pct = Math.round((s.base_stat / 255) * 100);
                    return (
                      <div
                        key={s.stat.name}
                        className="flex items-center gap-3"
                      >
                        <span className="w-14 shrink-0 text-right text-[11px] font-bold text-slate-400">
                          {m.label}
                        </span>
                        <span className="w-8 shrink-0 text-right text-xs font-black text-slate-700">
                          {s.base_stat}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: m.color,
                              transition:
                                "width .6s cubic-bezier(.34,1.1,.64,1)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-400">
                    <span>Total</span>
                    <span className="text-slate-700">{total}</span>
                  </div>
                </div>
              )}

              {tab === "abilities" && (
                <div className="space-y-2">
                  {data.abilities.map((a) => (
                    <div
                      key={a.ability.name}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                        a.is_hidden
                          ? "bg-amber-50 border-amber-200"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-800 capitalize">
                        {a.ability.name.replace(/-/g, " ")}
                      </span>
                      {a.is_hidden && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "sprites" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { src: data.sprites.front_default, label: "Default" },
                    { src: data.sprites.back_default, label: "Back" },
                    { src: data.sprites.front_shiny, label: "Shiny" },
                    { src: data.sprites.back_shiny, label: "Shiny back" },
                  ]
                    .filter((s) => s.src)
                    .map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-col items-center bg-slate-50 rounded-xl p-3 border border-slate-100"
                      >
                        <img
                          src={s.src}
                          alt={s.label}
                          className="w-20 h-20 object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="mt-1 text-[10px] font-bold text-slate-400">
                          {s.label}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(28px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes pop  { from { opacity:0; transform:scale(.8) translateY(8px) } to { opacity:1; transform:none } }
      `}</style>
    </div>
  );
}
