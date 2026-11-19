"use client";

import Link from "next/link";
import { Laptop, Smartphone } from "lucide-react";
import { useDemo } from "@/lib/store";
import { brl, dataBR, OBJETIVO_LABEL, PERFIL_LABEL } from "@/lib/labels";

export default function Perfil() {
  const { alunoAtual, chats } = useDemo();
  if (!alunoAtual) return null;
  const r = alunoAtual.resultado;
  const conversas = (chats[alunoAtual.email] ?? []).filter((m) => m.autor === "aluno").length;

  const linhas: [string, string][] = [
    ["Nome", alunoAtual.nome],
    ["E-mail de acesso", alunoAtual.email],
    ["Compra", `${alunoAtual.plataforma}, em ${dataBR(alunoAtual.compradoEm)}`],
    ["Acesso", "Vitalício"],
  ];
  const financeiro: [string, string][] = r
    ? [
        ["Perfil", PERFIL_LABEL[r.perfil]],
        ["Objetivo", OBJETIVO_LABEL[r.objetivo]],
        ["Carteira", r.codigo],
        ["Prazo", r.prazo],
        ["Custo de vida mensal", brl(r.custoVida)],
        ["Reserva atual", brl(r.reservaAtual)],
        ["Capital disponível", brl(r.capital)],
        ["Aporte mensal", brl(r.aporteMensal)],
      ]
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-[1.9rem] font-bold leading-tight">Meu perfil</h1>

      <section className="painel">
        <h2 className="font-display text-lg font-bold">Cadastro</h2>
        <dl className="mt-3 divide-y divide-ink/[0.07]">
          {linhas.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink-mute">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-ink-mute">Precisa trocar o e-mail de acesso? Fale com o suporte para validarmos sua compra.</p>
      </section>

      <section className="painel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Perfil de investidor</h2>
          <Link href="/app/questionario" className="btn-linha px-4 py-2 text-sm">
            Refazer questionário
          </Link>
        </div>
        {r ? (
          <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {financeiro.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-ink/[0.07] py-2.5">
                <dt className="text-ink-mute">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-ink-mute">Você ainda não respondeu o questionário.</p>
        )}
      </section>

      <section className="painel">
        <h2 className="font-display text-lg font-bold">Dispositivos conectados</h2>
        <p className="mt-1 text-sm text-ink-mute">Sua conta pode ficar conectada em até 2 dispositivos ao mesmo tempo.</p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3">
            <Laptop className="text-ink-soft" size={22} />
            <span className="flex-1">
              <span className="block font-semibold">Este navegador</span>
              <span className="text-sm text-ink-mute">Conectado agora</span>
            </span>
          </li>
          {alunoAtual.sessoesAtivas > 1 && (
            <li className="flex items-center gap-3">
              <Smartphone className="text-ink-soft" size={22} />
              <span className="flex-1">
                <span className="block font-semibold">iPhone, Safari</span>
                <span className="text-sm text-ink-mute">Último acesso há 2 dias</span>
              </span>
              <button type="button" className="text-sm font-semibold text-alerta">
                Desconectar
              </button>
            </li>
          )}
        </ul>
      </section>

      <p className="text-sm text-ink-mute">
        Você já fez {conversas} {conversas === 1 ? "pergunta" : "perguntas"} ao mentor virtual. O histórico fica salvo no
        seu cadastro.
      </p>
    </div>
  );
}
