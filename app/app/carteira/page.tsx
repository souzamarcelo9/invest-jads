"use client";

import Link from "next/link";
import { useState } from "react";
import { Maximize2, Minimize2, RefreshCw, ShieldCheck } from "lucide-react";
import { useDemo } from "@/lib/store";
import { dataBR } from "@/lib/labels";

export default function MinhaCarteira() {
  const { alunoAtual, carteiras } = useDemo();
  const [cheia, setCheia] = useState(false);
  const [chave, setChave] = useState(0);
  const r = alunoAtual?.resultado;
  const carteira = r ? carteiras.find((c) => c.codigo === r.codigo) : undefined;

  if (!r || !carteira) {
    return (
      <div className="painel mx-auto max-w-xl text-center">
        <p className="text-lg">Responda o questionário para descobrir qual é a sua carteira.</p>
        <Link href="/app/questionario" className="btn-ouro mt-5">
          Responder questionário
        </Link>
      </div>
    );
  }

  return (
    <div className={cheia ? "fixed inset-0 z-50 flex flex-col bg-paper p-3" : "mx-auto max-w-6xl"}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink font-display text-lg font-extrabold text-ouro">
            {carteira.codigo}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">{carteira.nome}</h1>
            <p className="text-sm text-ink-mute">Atualizada em {dataBR(carteira.atualizadaEm)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setChave((k) => k + 1)} className="btn-linha px-3 py-2 text-sm" aria-label="Recarregar carteira">
            <RefreshCw size={16} />
          </button>
          <button type="button" onClick={() => setCheia(!cheia)} className="btn-linha px-3 py-2 text-sm">
            {cheia ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {cheia ? "Sair da tela cheia" : "Tela cheia"}
          </button>
        </div>
      </div>

      <iframe
        key={chave}
        src={carteira.url}
        title={`Carteira ${carteira.codigo}`}
        className={`w-full rounded-panel bg-white ring-1 ring-ink/10 ${cheia ? "flex-1" : "h-[calc(100vh-230px)] min-h-[620px]"}`}
        referrerPolicy="no-referrer"
      />

      {!cheia && (
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-mute">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-folha" />
          A carteira abre dentro da plataforma, sem mostrar o endereço da página externa na barra do navegador.
        </p>
      )}
    </div>
  );
}
