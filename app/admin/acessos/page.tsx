"use client";

import { useState } from "react";
import { Copy, UserPlus } from "lucide-react";
import { TituloPagina } from "@/components/AdminShell";
import { useDemo } from "@/lib/store";
import { STATUS_LABEL } from "@/lib/labels";

export default function Acessos() {
  const { webhooks, alunos, liberarManual, definirStatus } = useDemo();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const bloqueados = alunos.filter((a) => a.status !== "ativo");
  const existe = alunos.some((a) => a.email === email.trim().toLowerCase());

  const urls = [
    { plataforma: "Hotmart", url: "https://seudominio.com.br/api/webhooks/hotmart" },
    { plataforma: "PayT", url: "https://seudominio.com.br/api/webhooks/payt" },
  ];

  return (
    <>
      <TituloPagina
        titulo="Acessos e compras"
        descricao="A plataforma recebe avisos da Hotmart ou PayT: libera o acesso na compra aprovada e bloqueia em reembolso ou chargeback."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="painel">
          <h2 className="font-display text-lg font-bold">Endereços para configurar nas plataformas</h2>
          <p className="mt-1 text-sm text-ink-mute">Cole o endereço na área de webhooks (postback) da plataforma de vendas.</p>
          <div className="mt-4 space-y-3">
            {urls.map((u) => (
              <div key={u.plataforma}>
                <p className="rotulo">{u.plataforma}</p>
                <div className="flex gap-2">
                  <code className="flex-1 truncate rounded-xl bg-paper px-3 py-2.5 text-sm">{u.url}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(u.url).catch(() => {});
                      setCopiado(u.plataforma);
                      setTimeout(() => setCopiado(null), 2000);
                    }}
                    className="btn-linha px-3 py-2 text-sm"
                  >
                    <Copy size={15} /> {copiado === u.plataforma ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="painel">
          <h2 className="font-display text-lg font-bold">Liberar acesso manualmente</h2>
          <p className="mt-1 text-sm text-ink-mute">Para vendas fora da plataforma ou casos de suporte.</p>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              liberarManual(nome, email);
              setOk(`Acesso liberado para ${email}.`);
              setNome("");
              setEmail("");
            }}
          >
            <div>
              <label htmlFor="nome" className="rotulo">Nome</label>
              <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="campo py-2.5" required />
            </div>
            <div>
              <label htmlFor="email-lib" className="rotulo">E-mail</label>
              <input id="email-lib" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setOk(null); }} className="campo py-2.5" required />
              {existe && <p className="mt-1 text-sm text-alerta">Este e-mail já tem cadastro. Use a página Alunos para liberar o acesso.</p>}
            </div>
            <button type="submit" disabled={!nome || !email.includes("@") || existe} className="btn-primario py-2.5 text-sm">
              <UserPlus size={16} /> Liberar acesso
            </button>
            {ok && <p className="text-sm text-folha">{ok}</p>}
          </form>
        </section>
      </div>

      <section className="painel mt-5">
        <h2 className="font-display text-lg font-bold">Histórico de eventos</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="border-b border-ink/10 text-sm text-ink-mute">
              <tr>
                <th className="py-2.5 pr-3 font-semibold">Recebido em</th>
                <th className="py-2.5 pr-3 font-semibold">Origem</th>
                <th className="py-2.5 pr-3 font-semibold">Evento</th>
                <th className="py-2.5 pr-3 font-semibold">E-mail</th>
                <th className="py-2.5 font-semibold">O que aconteceu</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((w) => (
                <tr key={w.id} className="border-b border-ink/[0.05] last:border-0">
                  <td className="py-2.5 pr-3 text-ink-mute">
                    {new Date(w.recebidoEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="py-2.5 pr-3">{w.plataforma}</td>
                  <td className="py-2.5 pr-3">
                    <code className="rounded bg-paper px-1.5 py-0.5 text-sm">{w.evento}</code>
                  </td>
                  <td className="py-2.5 pr-3">{w.email}</td>
                  <td className={`py-2.5 font-semibold ${w.acao.includes("bloqueado") ? "text-alerta" : "text-folha"}`}>{w.acao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="painel mt-5">
        <h2 className="font-display text-lg font-bold">Acessos bloqueados</h2>
        {bloqueados.length === 0 ? (
          <p className="mt-2 text-ink-mute">Nenhum acesso bloqueado no momento.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/[0.07]">
            {bloqueados.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="block font-semibold">{a.nome}</span>
                  <span className="text-sm text-ink-mute">
                    {a.email}, {STATUS_LABEL[a.status].toLowerCase()}
                  </span>
                </span>
                <button type="button" onClick={() => definirStatus(a.id, "ativo")} className="rounded-lg bg-folha-soft px-3 py-1.5 text-sm font-semibold text-folha">
                  Liberar acesso
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
