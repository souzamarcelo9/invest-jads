"use client";

import { TituloPagina } from "@/components/AdminShell";
import { CONSUMO_DIARIO } from "@/lib/data";
import { useDemo } from "@/lib/store";
import { brl } from "@/lib/labels";

export default function Consumo() {
  const { alunos, limites, definirStatus } = useDemo();
  const totalMsg = CONSUMO_DIARIO.reduce((s, d) => s + d.mensagens, 0);
  const totalCusto = CONSUMO_DIARIO.reduce((s, d) => s + d.custo, 0);
  const max = Math.max(...CONSUMO_DIARIO.map((d) => d.custo));
  const ativos = alunos.filter((a) => a.status === "ativo").length;
  const projecaoMes = (totalCusto / CONSUMO_DIARIO.length) * 30;
  const top = [...alunos].sort((a, b) => b.mensagensIA - a.mensagensIA).slice(0, 6);

  const kpis = [
    { rotulo: "Perguntas respondidas pela IA (14 dias)", valor: totalMsg.toLocaleString("pt-BR") },
    { rotulo: "Custo nos últimos 14 dias", valor: brl(totalCusto, 2) },
    { rotulo: "Projeção para 30 dias", valor: brl(projecaoMes, 2) },
    { rotulo: "Respondidas sem IA, por regras", valor: "38%" },
  ];

  return (
    <>
      <TituloPagina
        titulo="Consumo da IA"
        descricao={`Custo estimado com base nos tokens de cada conversa. Média de ${brl(projecaoMes / Math.max(1, ativos), 2)} por aluno ativo por mês.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.rotulo} className="rounded-2xl bg-white p-5 ring-1 ring-ink/[0.07]">
            <p className="text-sm text-ink-mute">{k.rotulo}</p>
            <p className="mt-1 font-display text-3xl font-bold">{k.valor}</p>
          </div>
        ))}
      </div>

      <section className="painel mt-5">
        <h2 className="font-display text-lg font-bold">Custo por dia</h2>
        <div className="mt-6 flex h-56 items-end gap-1.5 sm:gap-3" role="img" aria-label="Gráfico de custo diário da IA nos últimos 14 dias">
          {CONSUMO_DIARIO.map((d) => (
            <div key={d.dia} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[11px] font-semibold text-ink-soft opacity-0 transition-opacity group-hover:opacity-100">
                {brl(d.custo, 2)}
              </span>
              <div className="w-full rounded-t-lg bg-ink group-hover:bg-ouro" style={{ height: `${(d.custo / max) * 80}%` }} />
              <span className="text-[11px] text-ink-mute">{d.dia.slice(0, 2)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="painel">
          <h2 className="font-display text-lg font-bold">Alunos que mais usam o mentor</h2>
          <p className="mt-1 text-sm text-ink-mute">Uso muito acima da média pode indicar conta compartilhada.</p>
          <ul className="mt-4 divide-y divide-ink/[0.07]">
            {top.map((a) => {
              const suspeito = a.mensagensIA > limites.mensagensPorMes * 0.75;
              return (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block font-semibold">{a.nome}</span>
                    <span className="text-sm text-ink-mute">
                      {a.mensagensIA} perguntas, {brl(a.custoIA, 2)}
                    </span>
                  </span>
                  {suspeito && a.status === "ativo" ? (
                    <button
                      type="button"
                      onClick={() => definirStatus(a.id, "bloqueado")}
                      className="rounded-lg bg-alerta-soft px-3 py-1.5 text-sm font-semibold text-alerta"
                    >
                      Bloquear acesso
                    </button>
                  ) : (
                    <span className={`text-sm ${a.status === "ativo" ? "text-ink-mute" : "text-alerta"}`}>
                      {a.status === "ativo" ? "Uso normal" : "Bloqueado"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="painel h-fit">
          <h2 className="font-display text-lg font-bold">Como o custo é controlado</h2>
          <ul className="mt-3 space-y-3 text-[15px] text-ink-soft">
            <li>Perguntas fora do tema e sobre o próprio perfil são respondidas por regras, sem chamar a IA.</li>
            <li>Limite de {limites.mensagensPorDia} perguntas por dia e {limites.mensagensPorMes} por mês para cada aluno.</li>
            <li>Respostas curtas, de até {limites.maxTokensResposta} tokens, com indicação da aula para aprofundar.</li>
            <li>Só as últimas {limites.historicoEnviado} mensagens vão como contexto; o histórico completo fica no banco.</li>
            <li>Modelo econômico, adequado para atendimento educacional.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
