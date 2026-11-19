"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { PlayCircle, SendHorizontal, Zap } from "lucide-react";
import { useDemo } from "@/lib/store";
import { responder, SUGESTOES } from "@/lib/assistente";
import { PERFIL_LABEL, OBJETIVO_CURTO } from "@/lib/labels";
import type { MensagemChat } from "@/lib/types";

function agora() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${d
    .toTimeString()
    .slice(0, 5)}`;
}

function Chat() {
  const { alunoAtual, chats, adicionarMensagens, registrarUsoIA, usoHoje, limites, carteiras, aulas } = useDemo();
  const params = useSearchParams();
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);
  const enviouInicial = useRef(false);

  const email = alunoAtual?.email ?? "";
  const mensagens = chats[email] ?? [];
  const uso = usoHoje[email] ?? 0;
  const esgotado = uso >= limites.mensagensPorDia;
  const r = alunoAtual?.resultado;

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [mensagens.length, pensando]);

  function enviar(conteudo: string) {
    const t = conteudo.trim();
    if (!t || pensando || esgotado || !alunoAtual) return;
    const minha: MensagemChat = { id: `u${Date.now()}`, autor: "aluno", texto: t, hora: agora() };
    adicionarMensagens(email, [minha]);
    setTexto("");
    setPensando(true);
    const resposta = responder(t, alunoAtual, carteiras, aulas);
    setTimeout(
      () => {
        adicionarMensagens(email, [{ id: `a${Date.now()}`, autor: "assistente", hora: agora(), ...resposta }]);
        if (!resposta.semIA) registrarUsoIA(email);
        setPensando(false);
      },
      resposta.semIA ? 450 : 1300,
    );
  }

  useEffect(() => {
    const q = params.get("q");
    if (q && !enviouInicial.current && alunoAtual) {
      enviouInicial.current = true;
      enviar(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, alunoAtual]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.9rem] font-bold leading-tight">Mentor virtual</h1>
          <p className="text-ink-mute">
            {r
              ? `Conhece seu perfil ${PERFIL_LABEL[r.perfil].toLowerCase()}, seu objetivo (${OBJETIVO_CURTO[r.objetivo].toLowerCase()}) e sua Carteira ${r.codigo}.`
              : "Tira dúvidas sobre investimentos e sobre a plataforma."}
          </p>
        </div>
        <span className="rounded-lg bg-white px-3 py-1.5 text-sm text-ink-soft ring-1 ring-ink/10">
          {uso} de {limites.mensagensPorDia} perguntas hoje
        </span>
      </div>

      <div className="mt-6 flex h-[min(62vh,640px)] min-h-[360px] flex-col gap-4 overflow-y-auto rounded-panel bg-white p-4 ring-1 ring-ink/[0.07] sm:p-6">
        {mensagens.length === 0 && (
          <div className="py-8 text-center">
            <p className="font-display text-xl font-bold">Como posso ajudar hoje?</p>
            <p className="mt-1 text-ink-mute">Escolha uma sugestão ou escreva sua dúvida.</p>
          </div>
        )}

        {mensagens.map((m) =>
          m.autor === "aluno" ? (
            <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-white">
              {m.texto}
            </div>
          ) : (
            <div key={m.id} className="max-w-[92%]">
              <div className={`rounded-2xl rounded-bl-md px-4 py-3 ${m.foraDeEscopo ? "bg-ouro-soft/70" : "bg-paper"}`}>
                {m.texto.split("\n\n").map((par, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {par}
                  </p>
                ))}
                {(m.link || m.aula) && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {m.link && (
                      <Link href={m.link.href} className="btn-primario px-4 py-2 text-sm">
                        {m.link.rotulo}
                      </Link>
                    )}
                    {m.aula && (
                      <a
                        href={m.aula.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 text-sm ring-1 ring-ink/10 hover:ring-ink/30"
                      >
                        <PlayCircle size={20} className="shrink-0 text-conservador" />
                        <span>
                          <span className="block font-semibold">{m.aula.titulo}</span>
                          <span className="text-ink-mute">{m.aula.modulo}</span>
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </div>
              {m.semIA && (
                <p className="mt-1 flex items-center gap-1 pl-1 text-xs text-ink-mute">
                  <Zap size={12} /> Resposta automática, sem consumo de IA
                </p>
              )}
            </div>
          ),
        )}

        {pensando && (
          <div className="ponto-digitando flex w-fit gap-1 rounded-2xl bg-paper px-4 py-3.5" aria-label="O mentor está escrevendo">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-ink-mute" />
            ))}
          </div>
        )}
        <div ref={fimRef} />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {SUGESTOES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => enviar(s)}
            disabled={pensando || esgotado}
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-ink/10 hover:ring-ink/30 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        className="mt-3 flex items-end gap-2 rounded-2xl bg-white p-2 ring-1 ring-ink/15 focus-within:ring-ink md:bottom-4"
      >
        <label htmlFor="msg" className="sr-only">
          Sua pergunta
        </label>
        <textarea
          id="msg"
          rows={1}
          maxLength={500}
          value={texto}
          disabled={esgotado}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar(texto);
            }
          }}
          placeholder={esgotado ? "Você atingiu o limite de perguntas de hoje. Volte amanhã!" : "Escreva sua dúvida…"}
          className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 focus:outline-none"
        />
        <button type="submit" disabled={!texto.trim() || pensando || esgotado} className="btn-primario h-11 w-11 shrink-0 p-0" aria-label="Enviar">
          <SendHorizontal size={19} />
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-ink-mute">
        O mentor explica a metodologia e não faz recomendações individuais de investimento.
      </p>
    </div>
  );
}

export default function Assistente() {
  return (
    <Suspense fallback={<div className="text-ink-mute">Carregando…</div>}>
      <Chat />
    </Suspense>
  );
}
