"use client";

import Link from "next/link";
import { BookOpen, Compass, MessageCircle, Wallet } from "lucide-react";
import { useDemo } from "@/lib/store";
import { brl, OBJETIVO_LABEL, PERFIL_LABEL, PERFIL_TEXTO } from "@/lib/labels";
import { SUGESTOES } from "@/lib/assistente";

export default function Inicio() {
  const { alunoAtual, carteiras, aulas } = useDemo();
  if (!alunoAtual) return null;
  const r = alunoAtual.resultado;
  const primeiroNome = alunoAtual.nome.split(" ")[0];
  const carteira = r ? carteiras.find((c) => c.codigo === r.codigo) : undefined;

  if (!r) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[2rem] font-bold leading-tight">Boas-vindas, {primeiroNome}!</h1>
        <p className="mt-2 text-lg text-ink-mute">Seu primeiro passo é descobrir seu perfil de investidor.</p>
        <div className="painel mt-8 sm:p-9">
          <Compass className="text-ouro" size={34} />
          <h2 className="mt-4 text-2xl font-bold">Responda o questionário de perfil</h2>
          <p className="mt-2 max-w-xl text-ink-soft">
            São 11 perguntas rápidas sobre como você lida com riscos, o que espera dos seus investimentos e sua situação
            financeira. Leva cerca de 3 minutos e você só precisa responder uma vez.
          </p>
          <ul className="mt-5 space-y-2 text-ink-soft">
            <li>Seu perfil: conservador, moderado ou arrojado</li>
            <li>Seu objetivo financeiro</li>
            <li>A carteira da metodologia indicada para você</li>
            <li>Quanto você precisa ter de reserva de emergência</li>
          </ul>
          <Link href="/app/questionario" className="btn-ouro mt-7">
            Começar questionário
          </Link>
        </div>
      </div>
    );
  }

  const pctReserva = r.reservaIdeal > 0 ? Math.min(100, Math.round((r.reservaAtual / r.reservaIdeal) * 100)) : 100;
  const proximaAula = r.faltaReserva > 0 ? aulas.find((a) => a.id === "l2") : aulas.find((a) => a.id === "l9");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-[2rem] font-bold leading-tight">Olá, {primeiroNome}</h1>
      <p className="mt-1 text-lg text-ink-mute">Seu perfil está salvo. Continue de onde parou.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="relative overflow-hidden rounded-panel bg-ink p-7 text-white sm:p-9">
          <p className="text-white/70">Sua carteira</p>
          <div className="mt-2 flex items-end gap-5">
            <span className="font-display text-[5.5rem] font-extrabold leading-[0.8] text-ouro">{r.codigo}</span>
            <div className="pb-1">
              <p className="font-display text-xl font-bold">{carteira?.nome}</p>
              <p className="text-white/70">
                {PERFIL_LABEL[r.perfil]}, {OBJETIVO_LABEL[r.objetivo].toLowerCase()}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app/carteira" className="btn-ouro">
              <Wallet size={18} /> Abrir minha carteira
            </Link>
            <Link href="/app/resultado" className="btn border border-white/25 text-white hover:bg-white/10">
              Ver meu resultado
            </Link>
          </div>
        </section>

        <section className="painel">
          <h2 className="text-lg font-bold">Reserva de emergência</h2>
          <p className="mt-1 text-sm text-ink-mute">Meta: 6 meses do seu custo de vida</p>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold">{pctReserva}%</span>
            <span className="text-sm text-ink-mute">
              {brl(r.reservaAtual)} de {brl(r.reservaIdeal)}
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuenow={pctReserva} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full ${pctReserva >= 100 ? "bg-folha" : "bg-ouro"}`} style={{ width: `${pctReserva}%` }} />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            {r.faltaReserva > 0
              ? `Faltam ${brl(r.faltaReserva)}. Priorize completar a reserva antes de investir na carteira.`
              : "Reserva completa. Seus aportes podem ir direto para a carteira."}
          </p>
        </section>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <section className="painel">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="text-folha" size={22} />
            <h2 className="text-lg font-bold">Pergunte ao mentor virtual</h2>
          </div>
          <p className="mt-1 text-sm text-ink-mute">Disponível 24 horas, já conhece seu perfil e sua carteira.</p>
          <div className="mt-4 flex flex-col gap-2">
            {SUGESTOES.slice(0, 3).map((s) => (
              <Link
                key={s}
                href={`/app/assistente?q=${encodeURIComponent(s)}`}
                className="rounded-xl bg-paper px-4 py-2.5 text-[15px] font-semibold text-ink-soft hover:bg-paper-deep"
              >
                {s}
              </Link>
            ))}
          </div>
        </section>

        {proximaAula && (
          <section className="painel">
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-conservador" size={22} />
              <h2 className="text-lg font-bold">Aula recomendada</h2>
            </div>
            <p className="mt-4 text-sm text-ink-mute">{proximaAula.modulo}</p>
            <p className="font-display text-xl font-bold">{proximaAula.titulo}</p>
            <p className="mt-1 text-sm text-ink-mute">{proximaAula.duracao}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={proximaAula.url} target="_blank" rel="noreferrer" className="btn-linha">
                Assistir aula
              </a>
              <Link href="/app/aulas" className="btn px-2 text-ink-soft underline underline-offset-2">
                Todas as aulas
              </Link>
            </div>
          </section>
        )}
      </div>

      <p className={`mt-6 text-sm ${PERFIL_TEXTO[r.perfil]}`}>
        Seus objetivos mudaram?{" "}
        <Link href="/app/questionario" className="font-semibold underline underline-offset-2">
          Refazer questionário
        </Link>
      </p>
    </div>
  );
}
