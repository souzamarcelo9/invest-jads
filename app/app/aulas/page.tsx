"use client";

import { useMemo, useState } from "react";
import { ExternalLink, PlayCircle, Search } from "lucide-react";
import { useDemo } from "@/lib/store";

export default function Aulas() {
  const { aulas } = useDemo();
  const [busca, setBusca] = useState("");

  const grupos = useMemo(() => {
    const b = busca.trim().toLowerCase();
    const filtradas = aulas.filter(
      (a) => !b || a.titulo.toLowerCase().includes(b) || a.palavrasChave.some((k) => k.includes(b)),
    );
    const mapa = new Map<string, typeof aulas>();
    filtradas.forEach((a) => mapa.set(a.modulo, [...(mapa.get(a.modulo) ?? []), a]));
    return [...mapa.entries()];
  }, [aulas, busca]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-[1.9rem] font-bold leading-tight">Videoaulas</h1>
      <p className="mt-1 text-ink-mute">As aulas abrem na plataforma do curso, em uma nova aba.</p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" size={18} />
        <label htmlFor="busca" className="sr-only">
          Buscar aula
        </label>
        <input
          id="busca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por assunto, como reserva, FII ou tesouro"
          className="campo pl-11"
        />
      </div>

      <div className="mt-8 space-y-8">
        {grupos.length === 0 && <p className="text-ink-mute">Nenhuma aula encontrada para “{busca}”. Tente outra palavra.</p>}
        {grupos.map(([modulo, lista]) => (
          <section key={modulo}>
            <h2 className="mb-3 font-display text-lg font-bold">{modulo}</h2>
            <ol className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/[0.07]">
              {lista.map((a, i) => (
                <li key={a.id} className={i > 0 ? "border-t border-ink/[0.07]" : ""}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 px-4 py-3.5 hover:bg-paper/60"
                  >
                    <PlayCircle className="shrink-0 text-conservador" size={24} />
                    <span className="flex-1">
                      <span className="block font-semibold">{a.titulo}</span>
                      <span className="text-sm text-ink-mute">{a.duracao}</span>
                    </span>
                    <ExternalLink size={16} className="text-ink-mute" />
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
