"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TituloPagina } from "@/components/AdminShell";
import { useDemo } from "@/lib/store";
import type { Aula } from "@/lib/types";

export default function AdminAulas() {
  const { aulas, salvarAulas } = useDemo();
  const [lista, setLista] = useState<Aula[]>(aulas);
  const [salvo, setSalvo] = useState(false);

  function alterar(i: number, campo: keyof Aula, valor: string) {
    setSalvo(false);
    setLista(
      lista.map((a, j) =>
        j === i ? { ...a, [campo]: campo === "palavrasChave" ? valor.split(",").map((s) => s.trim().toLowerCase()) : valor } : a,
      ),
    );
  }

  return (
    <>
      <TituloPagina
        titulo="Videoaulas"
        descricao="O mentor usa as palavras-chave para indicar a aula certa em cada resposta. Os vídeos continuam na sua plataforma de cursos."
        acao={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setLista([...lista, { id: `l${Date.now()}`, modulo: "", titulo: "", url: "", palavrasChave: [], duracao: "" }])
              }
              className="btn-linha py-2.5 text-sm"
            >
              <Plus size={16} /> Adicionar aula
            </button>
            <button
              type="button"
              onClick={() => {
                salvarAulas(lista.filter((a) => a.titulo.trim()));
                setSalvo(true);
              }}
              className="btn-primario py-2.5 text-sm"
            >
              {salvo ? "Aulas salvas" : "Salvar aulas"}
            </button>
          </div>
        }
      />

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/[0.07]">
        <table className="w-full min-w-[920px] text-left text-[15px]">
          <thead className="border-b border-ink/10 text-sm text-ink-mute">
            <tr>
              <th className="px-3 py-3 font-semibold">Módulo</th>
              <th className="px-3 py-3 font-semibold">Título da aula</th>
              <th className="px-3 py-3 font-semibold">Link</th>
              <th className="px-3 py-3 font-semibold">Palavras-chave</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {lista.map((a, i) => (
              <tr key={a.id} className="border-b border-ink/[0.05] align-top last:border-0">
                {(["modulo", "titulo", "url"] as const).map((campo) => (
                  <td key={campo} className="px-2 py-2">
                    <input
                      aria-label={campo}
                      value={a[campo]}
                      onChange={(e) => alterar(i, campo, e.target.value)}
                      className="w-full rounded-lg border border-transparent px-2 py-1.5 hover:border-ink/15 focus:border-ink focus:outline-none"
                    />
                  </td>
                ))}
                <td className="px-2 py-2">
                  <input
                    aria-label="Palavras-chave"
                    value={a.palavrasChave.join(", ")}
                    onChange={(e) => alterar(i, "palavrasChave", e.target.value)}
                    className="w-full rounded-lg border border-transparent px-2 py-1.5 text-ink-soft hover:border-ink/15 focus:border-ink focus:outline-none"
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    aria-label={`Remover aula ${a.titulo}`}
                    onClick={() => setLista(lista.filter((_, j) => j !== i))}
                    className="rounded-lg p-1.5 text-ink-mute hover:text-alerta"
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
