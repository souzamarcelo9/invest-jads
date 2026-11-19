"use client";

import Link from "next/link";
import { useState } from "react";
import { LifeBuoy, Wallet } from "lucide-react";
import { MatrizCarteiras } from "@/components/MatrizCarteiras";
import { useDemo } from "@/lib/store";
import { MESES_RESERVA } from "@/lib/quiz";
import { brl, OBJETIVO_EXPLICACAO, OBJETIVO_LABEL, PERFIL_EXPLICACAO, PERFIL_LABEL, PERFIL_TEXTO } from "@/lib/labels";

export default function Resultado() {
  const { alunoAtual, carteiras } = useDemo();
  const [ciente, setCiente] = useState(false);
  const r = alunoAtual?.resultado;

  if (!r) {
    return (
      <div className="painel mx-auto max-w-xl text-center">
        <p className="text-lg">Você ainda não respondeu o questionário.</p>
        <Link href="/app/questionario" className="btn-ouro mt-5">
          Responder questionário
        </Link>
      </div>
    );
  }

  const carteira = carteiras.find((c) => c.codigo === r.codigo);
  const semReserva = r.faltaReserva > 0;
  const restante = Math.max(0, r.faltaReserva - r.capital);
  const meses = restante > 0 && r.aporteMensal > 0 ? Math.ceil(restante / r.aporteMensal) : null;
  const liberado = !semReserva || ciente;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-ink-mute">Seu resultado</p>
      <h1 className="mt-1 max-w-3xl text-[2rem] font-bold leading-tight sm:text-[2.5rem]">
        Você é um investidor <span className={PERFIL_TEXTO[r.perfil]}>{PERFIL_LABEL[r.perfil].toLowerCase()}</span> com foco
        em {OBJETIVO_LABEL[r.objetivo].toLowerCase()}.
      </h1>

      <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <section className="painel">
            <h2 className="text-sm font-semibold text-ink-mute">Perfil de investidor</h2>
            <p className={`font-display text-2xl font-bold ${PERFIL_TEXTO[r.perfil]}`}>{PERFIL_LABEL[r.perfil]}</p>
            <p className="mt-2 text-ink-soft">{PERFIL_EXPLICACAO[r.perfil]}</p>
          </section>
          <section className="painel">
            <h2 className="text-sm font-semibold text-ink-mute">Objetivo financeiro</h2>
            <p className="font-display text-2xl font-bold">{OBJETIVO_LABEL[r.objetivo]}</p>
            <p className="mt-2 text-ink-soft">{OBJETIVO_EXPLICACAO[r.objetivo]}</p>
          </section>
        </div>

        <section className="painel">
          <h2 className="font-display text-xl font-bold">Onde você está no mapa das carteiras</h2>
          <p className="mt-1 text-ink-mute">
            A metodologia tem 9 carteiras, uma para cada combinação de perfil e objetivo.
          </p>
          <div className="mt-5">
            <MatrizCarteiras destaque={r.codigo} />
          </div>
          <p className="mt-4 text-ink-soft">
            Sua carteira é a <strong className="text-ink">{r.codigo}</strong>
            {carteira ? `, ${carteira.nome}` : ""}.
          </p>
        </section>
      </div>

      {semReserva && (
        <section className="mt-5 rounded-panel border-2 border-ouro bg-ouro-soft/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <LifeBuoy className="mt-1 shrink-0 text-ouro-deep" size={30} />
            <div>
              <h2 className="text-2xl font-bold">Antes da carteira: complete sua reserva de emergência</h2>
              <p className="mt-2 max-w-2xl text-ink-soft">
                A reserva é o dinheiro que protege você de imprevistos, como perder o emprego ou um problema de saúde,
                sem precisar vender seus investimentos no pior momento. Ela deve ficar em um investimento seguro e com
                resgate imediato.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <dt className="text-sm text-ink-mute">Reserva ideal</dt>
              <dd className="font-display text-2xl font-bold">{brl(r.reservaIdeal)}</dd>
              <dd className="text-sm text-ink-mute">
                {MESES_RESERVA} × {brl(r.custoVida)} de custo mensal
              </dd>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <dt className="text-sm text-ink-mute">Você já tem</dt>
              <dd className="font-display text-2xl font-bold">{brl(r.reservaAtual)}</dd>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <dt className="text-sm text-ink-mute">Falta juntar</dt>
              <dd className="font-display text-2xl font-bold text-ouro-deep">{brl(r.faltaReserva)}</dd>
              {restante === 0 ? (
                <dd className="text-sm text-ink-mute">Dá para completar agora com o capital disponível</dd>
              ) : (
                meses && (
                  <dd className="text-sm text-ink-mute">
                    Cerca de {meses} {meses === 1 ? "mês" : "meses"}, usando o capital disponível e aportes de{" "}
                    {brl(r.aporteMensal)}
                  </dd>
                )
              )}
            </div>
          </dl>

          {r.capital > 0 && (
            <p className="mt-4 text-ink-soft">
              Você informou {brl(r.capital)} disponíveis agora.{" "}
              {r.capital >= r.faltaReserva
                ? `Use ${brl(r.faltaReserva)} para completar a reserva e invista o restante, ${brl(r.capital - r.faltaReserva)}, na sua carteira.`
                : "Pela metodologia, esse valor deve ir primeiro para a reserva."}
            </p>
          )}

          <label className="mt-6 flex cursor-pointer items-start gap-3 font-semibold">
            <input
              type="checkbox"
              checked={ciente}
              onChange={(e) => setCiente(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[#0E3B43]"
            />
            Entendi a orientação e vou priorizar minha reserva de emergência.
          </label>
        </section>
      )}

      <section className="mt-5 flex flex-col items-start justify-between gap-5 rounded-panel bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-white/70">Carteira {r.codigo}</p>
          <p className="font-display text-2xl font-bold">{carteira?.nome}</p>
          <p className="mt-1 text-white/70">Ativos, percentuais e a calculadora que distribui seu aporte.</p>
        </div>
        {liberado ? (
          <Link href="/app/carteira" className="btn-ouro shrink-0">
            <Wallet size={18} /> Acessar minha carteira
          </Link>
        ) : (
          <span className="btn shrink-0 cursor-not-allowed bg-white/10 text-white/60">Leia a orientação acima</span>
        )}
      </section>

      <p className="mt-6 text-sm text-ink-mute">
        Respostas salvas em seu cadastro. Seus objetivos mudaram?{" "}
        <Link href="/app/questionario" className="font-semibold text-ink underline underline-offset-2">
          Refazer questionário
        </Link>
      </p>
    </div>
  );
}
