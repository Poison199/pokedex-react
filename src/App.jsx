import { useState, useEffect, useCallback } from "react";
import PokemonModal from "./components/PokemonModal";

export const TYPE_META = {
  normal: { hex: "#9CA3AF" },
  fire: { hex: "#F97316" },
  water: { hex: "#3B82F6" },
  electric: { hex: "#EAB308" },
  grass: { hex: "#22C55E" },
  ice: { hex: "#06B6D4" },
  fighting: { hex: "#EF4444" },
  poison: { hex: "#A855F7" },
  ground: { hex: "#D97706" },
  flying: { hex: "#818CF8" },
  psychic: { hex: "#EC4899" },
  bug: { hex: "#84CC16" },
  rock: { hex: "#A16207" },
  ghost: { hex: "#7C3AED" },
  dragon: { hex: "#4F46E5" },
  dark: { hex: "#44403C" },
  steel: { hex: "#64748B" },
  fairy: { hex: "#F472B6" },
};

const TYPES = [
  "all",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "fighting",
  "rock",
  "ghost",
  "dragon",
  "ice",
  "bug",
  "poison",
  "flying",
  "normal",
  "fairy",
  "steel",
  "dark",
];

const idFromUrl = (url) => parseInt(url.split("/").filter(Boolean).pop());
const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const PAGE = 24;

export default function App() {
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState(null);
  const [typeCache, setTypeCache] = useState({});
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((r) => r.json())
      .then((j) => {
        setAll(j.results);
        setFiltered(j.results);
      });
  }, []);

  const run = useCallback(
    async (t, q, list) => {
      let res = list;
      if (t !== "all") {
        let names = typeCache[t];
        if (!names) {
          const r = await fetch(`https://pokeapi.co/api/v2/type/${t}`);
          const j = await r.json();
          names = new Set(j.pokemon.map((p) => p.pokemon.name));
          setTypeCache((prev) => ({ ...prev, [t]: names }));
        }
        res = list.filter((p) => names.has(p.name));
      }
      if (q) res = res.filter((p) => p.name.includes(q.toLowerCase()));
      setFiltered(res);
      setPage(0);
    },
    [typeCache],
  );

  useEffect(() => {
    if (all.length) run(type, search, all);
  }, [type, search, all]);

  const slice = filtered.slice(page * PAGE, (page + 1) * PAGE);
  const totalPages = Math.ceil(filtered.length / PAGE);

  useEffect(() => {
    slice.forEach((p) => {
      if (cardData[p.name]) return;
      fetch(p.url)
        .then((r) => r.json())
        .then((d) => setCardData((prev) => ({ ...prev, [p.name]: d })));
    });
  }, [slice]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5">
          {/* Row 1: logo + search + count — all on one line, no wrap */}
          <div className="flex items-center gap-3 h-14 min-w-0">
            <h1 className="shrink-0 text-lg font-black tracking-tight">
              <span className="text-slate-900">Poké</span>
              <span className="text-indigo-500">dex</span>
            </h1>

            <div className="relative min-w-0 w-56 shrink-0">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="h-9 w-full rounded-full bg-slate-100 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
              />
            </div>

            <span className="ml-auto shrink-0 text-xs font-semibold text-slate-400 whitespace-nowrap">
              {filtered.length} found
            </span>
          </div>

          {/* Row 2: type chips — horizontal scroll, never wraps */}
          <div
            className="flex items-center gap-1.5 pb-2.5 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {TYPES.map((t) => {
              const active = type === t;
              const hex = TYPE_META[t]?.hex ?? "#6366f1";
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="shrink-0 h-7 rounded-full border text-xs font-bold capitalize px-3 transition-all duration-150 whitespace-nowrap"
                  style={
                    active
                      ? {
                          background: hex,
                          color: "#fff",
                          borderColor: "transparent",
                        }
                      : {
                          background: "transparent",
                          color: hex,
                          borderColor: hex + "66",
                        }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Grid ── */}
      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {slice.map((p) => {
            const id = idFromUrl(p.url);
            const data = cardData[p.name];
            const types = data?.types ?? [];
            const hex = TYPE_META[types[0]?.type?.name]?.hex ?? "#6366f1";

            return (
              <button
                key={p.name}
                onClick={() => setSelected(p.url)}
                className="group relative flex flex-col items-center rounded-2xl bg-white border border-slate-100 px-2 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 overflow-hidden cursor-pointer w-full"
              >
                <div
                  className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{ background: hex }}
                />

                <span className="relative self-start text-[9px] font-bold text-slate-400 mb-1 leading-none">
                  #{String(id).padStart(3, "0")}
                </span>

                <img
                  src={artworkUrl(id)}
                  alt={p.name}
                  loading="lazy"
                  className="relative w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200"
                  style={{ filter: `drop-shadow(0 4px 8px ${hex}55)` }}
                />

                <p className="relative mt-2 text-[11px] font-extrabold text-slate-800 capitalize text-center leading-tight w-full truncate px-1">
                  {p.name}
                </p>

                <div className="relative flex flex-wrap justify-center gap-1 mt-1.5">
                  {types.map((t) => {
                    const th = TYPE_META[t.type.name]?.hex ?? "#888";
                    return (
                      <span
                        key={t.type.name}
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full capitalize leading-none"
                        style={{ background: th + "22", color: th }}
                      >
                        {t.type.name}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-700 shadow-sm disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-150"
            >
              ← Prev
            </button>
            <span className="text-sm font-semibold text-slate-400 tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-700 shadow-sm disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-150"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {selected && (
        <PokemonModal url={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
