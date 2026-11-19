"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { TituloPagina } from "@/components/AdminShell";
import { useDemo } from "@/lib/store";
import { dataBR, OBJETIVOS, OBJETIVO_CURTO, PERFIS, PERFIL_LABEL, PERFIL_TEXTO } from "@/lib/labels";
import type { Carteira } from "@/lib/types";

function Linha({ c, onSalvar }: { c: Carteira; onSalvar: (url: string) => void }) {
  const [url, setUrl] = useState(c.url);
  const [salvo, setSalvo] = useState(false);
  const mudou = url !== c.url;

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07]">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink font-display font-extrabold text-ouro">{c.codigo}</span>
        <div className="min-w-0">
          <p className="font-semibold">{c.nome}</p>
          <p className="text-sm text-ink-mute">
            {OBJETIVO_CURTO[c.objetivo]}, atualizado em {dataBR(c.atualizadaEm)}
          </p>
        </div>
      </div>
      <label htmlFor={`url-${c.codigo}`} className="sr-only">
        Link da carteira {c.codigo}
      </label>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={`url-${c.codigo}`}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setSalvo(false);
          }}
          className="campo py-2.5 text-[15px]"
          placeholder="https://"
        />
        <div className="flex gap-2">
          <a href={url} target="_blank" rel="noreferrer" className="btn-linha px-3 py-2.5 text-sm" aria-label={`Testar link da carteira ${c.codigo}`}>
            <ExternalLink size={16} /> Testar
          </a>
          <button
            type="button"
            disabled={!mudou}
            onClick={() => {
              onSalvar(url);
              setSalvo(true);
            }}
            className="btn-primario px-4 py-2.5 text-sm"
          >
            {salvo && !mudou ? <Check size={16} /> : null}
            {salvo && !mudou ? "Salvo" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Carteiras() {
  const { carteiras, atualizarCarteira } = useDemo();

  return (
    <>
      <TituloPagina
        titulo="Links das carteiras"
        descricao="Cada combinação de perfil e objetivo leva a uma página externa. Ao trocar um link aqui, todos os alunos daquela carteira passam a ver a nova página na hora."
      />
      <div className="space-y-8">
        {PERFIS.map((p) => (
          <section key={p}>
            <h2 className={`mb-3 font-display text-xl font-bold ${PERFIL_TEXTO[p]}`}>{PERFIL_LABEL[p]}</h2>
            <div className="grid gap-3 xl:grid-cols-3">
              {OBJETIVOS.map((o) => {
                const c = carteiras.find((x) => x.perfil === p && x.objetivo === o)!;
                return <Linha key={c.codigo} c={c} onSalvar={(url) => atualizarCarteira(c.codigo, url)} />;
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
