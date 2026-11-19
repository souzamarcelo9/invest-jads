"use client";

import Link from "next/link";
import { TituloPagina } from "@/components/AdminShell";
import { MatrizCarteiras } from "@/components/MatrizCarteiras";
import { useDemo } from "@/lib/store";
import { brl, dataBR, OBJETIVO_CURTO, PERFIL_LABEL } from "@/lib/labels";
import { CONSUMO_DIARIO } from "@/lib/data";

export default function VisaoGeral() {
  const { alunos, webhooks } = useDemo();
  const ativos = alunos.filter((a) => a.status === "ativo");
  const comResultado = ativos.filter((a) => a.resultado);
  const semReserva = comResultado.filter((a) => a.resultado!.faltaReserva > 0);
  const custo = CONSUMO_DIARIO.reduce((s, d) => s + d.custo, 0);

  const contagens: Record<string, number> = {};
  comResultado.forEach((a) => {
    contagens[a.resultado!.codigo] = (contagens[a.resultado!.codigo] ?? 0) + 1;
  });

  const maiorCapital = [...comResultado].sort((a, b) => b.resultado!.capital - a.resultado!.capital).slice(0, 5);

  const kpis = [
    { rotulo: "Alunos com acesso ativo", valor: String(ativos.length) },
    { rotulo: "Responderam o questionário", valor: `${comResultado.length} de ${ativos.length}` },
    { rotulo: "Ainda sem reserva completa", valor: String(semReserva.length) },
    { rotulo: "Custo da IA nos últimos 14 dias", valor: brl(custo, 2) },
  ];

  return (
    <>
      <TituloPagina titulo="Visão geral" descricao="Resumo dos alunos, das carteiras e do uso do mentor virtual." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.rotulo} className="rounded-2xl bg-white p-5 ring-1 ring-ink/[0.07]">
            <p className="text-sm text-ink-mute">{k.rotulo}</p>
            <p className="mt-1 font-display text-3xl font-bold">{k.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="painel">
          <h2 className="font-display text-lg font-bold">Alunos por carteira</h2>
          <p className="mt-1 text-sm text-ink-mute">Quanto mais escura a célula, mais alunos nessa combinação.</p>
          <div className="mt-4">
            <MatrizCarteiras contagens={contagens} />
          </div>
        </section>

        <section className="painel">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-bold">Maior capital disponível</h2>
            <Link href="/admin/alunos?ordem=capital" className="text-sm font-semibold text-ink-soft underline underline-offset-2">
              Ver todos
            </Link>
          </div>
          <p className="mt-1 text-sm text-ink-mute">Bons contatos para ofertas de pós-venda.</p>
          <ul className="mt-4 divide-y divide-ink/[0.07]">
            {maiorCapital.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <span>
                  <span className="block font-semibold">{a.nome}</span>
                  <span className="text-sm text-ink-mute">
                    {PERFIL_LABEL[a.resultado!.perfil]}, {OBJETIVO_CURTO[a.resultado!.objetivo].toLowerCase()}
                  </span>
                </span>
                <span className="font-display font-bold">{brl(a.resultado!.capital)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="painel mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Últimos eventos de compra</h2>
          <Link href="/admin/acessos" className="text-sm font-semibold text-ink-soft underline underline-offset-2">
            Ver histórico
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-ink/[0.07]">
          {webhooks.slice(0, 4).map((w) => (
            <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span>
                <span className="font-semibold">{w.email}</span>
                <span className="ml-2 text-sm text-ink-mute">
                  {w.plataforma}, {dataBR(w.recebidoEm)}
                </span>
              </span>
              <span
                className={`rounded-lg px-2.5 py-1 text-sm font-semibold ${
                  w.acao.includes("bloqueado") ? "bg-alerta-soft text-alerta" : "bg-folha-soft text-folha"
                }`}
              >
                {w.acao}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
