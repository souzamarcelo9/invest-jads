"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { TituloPagina } from "@/components/AdminShell";
import { useDemo } from "@/lib/store";
import { brl, dataBR, OBJETIVOS, OBJETIVO_CURTO, PERFIS, PERFIL_LABEL, PERFIL_TEXTO, STATUS_LABEL } from "@/lib/labels";
import type { Aluno } from "@/lib/types";

const FAIXAS = [
  { valor: 0, rotulo: "Qualquer capital" },
  { valor: 10000, rotulo: "A partir de R$ 10 mil" },
  { valor: 50000, rotulo: "A partir de R$ 50 mil" },
  { valor: 100000, rotulo: "A partir de R$ 100 mil" },
  { valor: 250000, rotulo: "A partir de R$ 250 mil" },
];

function Lista() {
  const { alunos, definirStatus, corrigirEmail, encerrarSessoes } = useDemo();
  const params = useSearchParams();
  const [busca, setBusca] = useState("");
  const [perfil, setPerfil] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [capitalMin, setCapitalMin] = useState(0);
  const [status, setStatus] = useState("");
  const [ordem, setOrdem] = useState(params.get("ordem") === "capital" ? "capital" : "recentes");
  const [abertoId, setAbertoId] = useState<string | null>(null);

  const lista = useMemo(() => {
    const b = busca.trim().toLowerCase();
    const f = alunos.filter((a) => {
      if (b && !a.nome.toLowerCase().includes(b) && !a.email.includes(b)) return false;
      if (perfil && a.resultado?.perfil !== perfil) return false;
      if (objetivo && a.resultado?.objetivo !== objetivo) return false;
      if (capitalMin && (a.resultado?.capital ?? 0) < capitalMin) return false;
      if (status === "sem_questionario" && a.resultado) return false;
      if (status && status !== "sem_questionario" && a.status !== status) return false;
      return true;
    });
    return f.sort((x, y) =>
      ordem === "capital"
        ? (y.resultado?.capital ?? 0) - (x.resultado?.capital ?? 0)
        : y.compradoEm.localeCompare(x.compradoEm),
    );
  }, [alunos, busca, perfil, objetivo, capitalMin, status, ordem]);

  const aberto = alunos.find((a) => a.id === abertoId);

  function exportar() {
    const cab = "nome,email,status,perfil,objetivo,carteira,capital,aporte_mensal,falta_reserva\n";
    const linhas = lista
      .map((a) =>
        [
          a.nome,
          a.email,
          a.status,
          a.resultado?.perfil ?? "",
          a.resultado?.objetivo ?? "",
          a.resultado?.codigo ?? "",
          a.resultado?.capital ?? "",
          a.resultado?.aporteMensal ?? "",
          a.resultado?.faltaReserva ?? "",
        ].join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([cab + linhas], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "alunos.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <TituloPagina
        titulo="Alunos"
        descricao="Filtre por perfil e capital para encontrar oportunidades de pós-venda."
        acao={
          <button type="button" onClick={exportar} className="btn-linha py-2.5 text-sm">
            <Download size={16} /> Exportar {lista.length} em CSV
          </button>
        }
      />

      <div className="grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07] sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" size={17} />
          <input aria-label="Buscar aluno" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome ou e-mail" className="campo py-2.5 pl-10" />
        </div>
        <select aria-label="Perfil" value={perfil} onChange={(e) => setPerfil(e.target.value)} className="campo py-2.5">
          <option value="">Todos os perfis</option>
          {PERFIS.map((p) => (
            <option key={p} value={p}>{PERFIL_LABEL[p]}</option>
          ))}
        </select>
        <select aria-label="Objetivo" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="campo py-2.5">
          <option value="">Todos os objetivos</option>
          {OBJETIVOS.map((o) => (
            <option key={o} value={o}>{OBJETIVO_CURTO[o]}</option>
          ))}
        </select>
        <select aria-label="Capital disponível" value={capitalMin} onChange={(e) => setCapitalMin(Number(e.target.value))} className="campo py-2.5">
          {FAIXAS.map((f) => (
            <option key={f.valor} value={f.valor}>{f.rotulo}</option>
          ))}
        </select>
        <select aria-label="Situação" value={status} onChange={(e) => setStatus(e.target.value)} className="campo py-2.5">
          <option value="">Todas as situações</option>
          <option value="ativo">Ativos</option>
          <option value="sem_questionario">Sem questionário</option>
          <option value="bloqueado">Bloqueados manualmente</option>
          <option value="reembolsado">Reembolsados</option>
          <option value="chargeback">Chargeback</option>
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-ink-mute">
        <span>{lista.length} alunos</span>
        <label className="flex items-center gap-2">
          Ordenar por
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)} className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-ink">
            <option value="recentes">Compras recentes</option>
            <option value="capital">Maior capital</option>
          </select>
        </label>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/[0.07]">
        <table className="w-full min-w-[820px] text-left text-[15px]">
          <thead className="border-b border-ink/10 text-sm text-ink-mute">
            <tr>
              <th className="px-4 py-3 font-semibold">Aluno</th>
              <th className="px-4 py-3 font-semibold">Perfil e objetivo</th>
              <th className="px-4 py-3 font-semibold">Carteira</th>
              <th className="px-4 py-3 text-right font-semibold">Capital</th>
              <th className="px-4 py-3 text-right font-semibold">Aporte/mês</th>
              <th className="px-4 py-3 font-semibold">Reserva</th>
              <th className="px-4 py-3 font-semibold">Situação</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id} onClick={() => setAbertoId(a.id)} className="cursor-pointer border-b border-ink/[0.05] last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3">
                  <button type="button" className="text-left" onClick={() => setAbertoId(a.id)}>
                    <span className="block font-semibold">{a.nome}</span>
                    <span className="text-sm text-ink-mute">{a.email}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  {a.resultado ? (
                    <>
                      <span className={`block font-semibold ${PERFIL_TEXTO[a.resultado.perfil]}`}>{PERFIL_LABEL[a.resultado.perfil]}</span>
                      <span className="text-sm text-ink-mute">{OBJETIVO_CURTO[a.resultado.objetivo]}</span>
                    </>
                  ) : (
                    <span className="text-sm text-ink-mute">Sem questionário</span>
                  )}
                </td>
                <td className="px-4 py-3 font-display font-bold">{a.resultado?.codigo ?? "—"}</td>
                <td className="px-4 py-3 text-right font-semibold">{a.resultado ? brl(a.resultado.capital) : "—"}</td>
                <td className="px-4 py-3 text-right">{a.resultado ? brl(a.resultado.aporteMensal) : "—"}</td>
                <td className="px-4 py-3 text-sm">
                  {a.resultado ? (a.resultado.faltaReserva > 0 ? <span className="text-ouro-deep">Incompleta</span> : <span className="text-folha">Completa</span>) : "—"}
                </td>
                <td className="px-4 py-3">
                  <Status a={a} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <p className="p-6 text-center text-ink-mute">Nenhum aluno com esses filtros. Remova algum filtro para ver mais.</p>}
      </div>

      {aberto && (
        <Detalhe
          aluno={aberto}
          onFechar={() => setAbertoId(null)}
          onStatus={(s) => definirStatus(aberto.id, s)}
          onEmail={(e) => corrigirEmail(aberto.id, e)}
          onEncerrar={() => encerrarSessoes(aberto.id)}
        />
      )}
    </>
  );
}

function Status({ a }: { a: Aluno }) {
  const cor = a.status === "ativo" ? "bg-folha-soft text-folha" : "bg-alerta-soft text-alerta";
  return <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-sm font-semibold ${cor}`}>{STATUS_LABEL[a.status]}</span>;
}

function Detalhe({
  aluno,
  onFechar,
  onStatus,
  onEmail,
  onEncerrar,
}: {
  aluno: Aluno;
  onFechar: () => void;
  onStatus: (s: Aluno["status"]) => void;
  onEmail: (e: string) => void;
  onEncerrar: () => void;
}) {
  const [novoEmail, setNovoEmail] = useState(aluno.email);
  const [salvo, setSalvo] = useState(false);
  const r = aluno.resultado;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Detalhes de ${aluno.nome}`}>
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-ink/40" onClick={onFechar} />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-paper p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{aluno.nome}</h2>
            <p className="text-ink-mute">
              {aluno.plataforma}, comprado em {dataBR(aluno.compradoEm)}
            </p>
          </div>
          <button type="button" onClick={onFechar} aria-label="Fechar" className="rounded-lg p-1.5 hover:bg-white">
            <X />
          </button>
        </div>
        <div className="mt-3">
          <Status a={aluno} />
        </div>

        {r && (
          <section className="mt-6 rounded-2xl bg-white p-4">
            <h3 className="font-display font-bold">Resultado do questionário</h3>
            <dl className="mt-2 grid grid-cols-2 gap-y-2 text-[15px]">
              <dt className="text-ink-mute">Perfil</dt>
              <dd className="font-semibold">{PERFIL_LABEL[r.perfil]} ({r.pontuacao} pts)</dd>
              <dt className="text-ink-mute">Objetivo</dt>
              <dd className="font-semibold">{OBJETIVO_CURTO[r.objetivo]}</dd>
              <dt className="text-ink-mute">Carteira</dt>
              <dd className="font-semibold">{r.codigo}</dd>
              <dt className="text-ink-mute">Prazo</dt>
              <dd className="font-semibold">{r.prazo}</dd>
              <dt className="text-ink-mute">Capital</dt>
              <dd className="font-semibold">{brl(r.capital)}</dd>
              <dt className="text-ink-mute">Aporte mensal</dt>
              <dd className="font-semibold">{brl(r.aporteMensal)}</dd>
              <dt className="text-ink-mute">Custo de vida</dt>
              <dd className="font-semibold">{brl(r.custoVida)}</dd>
              <dt className="text-ink-mute">Reserva</dt>
              <dd className="font-semibold">
                {brl(r.reservaAtual)} de {brl(r.reservaIdeal)}
              </dd>
            </dl>
          </section>
        )}

        <section className="mt-4 rounded-2xl bg-white p-4">
          <h3 className="font-display font-bold">Uso do mentor virtual</h3>
          <p className="mt-1 text-[15px]">
            {aluno.mensagensIA} perguntas, custo estimado de {brl(aluno.custoIA, 2)}
          </p>
          <p className="text-[15px]">
            {aluno.sessoesAtivas} {aluno.sessoesAtivas === 1 ? "dispositivo conectado" : "dispositivos conectados"}
          </p>
          {aluno.sessoesAtivas > 0 && (
            <button type="button" onClick={onEncerrar} className="mt-2 text-sm font-semibold text-ink-soft underline underline-offset-2">
              Desconectar todos os dispositivos
            </button>
          )}
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4">
          <h3 className="font-display font-bold">Corrigir e-mail de acesso</h3>
          <p className="mt-1 text-sm text-ink-mute">Use somente depois de confirmar a identidade e a compra do aluno.</p>
          <div className="mt-3 flex gap-2">
            <input
              aria-label="Novo e-mail"
              value={novoEmail}
              onChange={(e) => {
                setNovoEmail(e.target.value);
                setSalvo(false);
              }}
              className="campo py-2"
            />
            <button
              type="button"
              disabled={!novoEmail.includes("@") || novoEmail === aluno.email}
              onClick={() => {
                onEmail(novoEmail);
                setSalvo(true);
              }}
              className="btn-primario shrink-0 px-4 py-2 text-sm"
            >
              Salvar e-mail
            </button>
          </div>
          {salvo && <p className="mt-2 text-sm text-folha">E-mail salvo. O aluno já pode entrar com o novo endereço.</p>}
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4">
          <h3 className="font-display font-bold">Acesso</h3>
          {aluno.status === "ativo" ? (
            <button type="button" onClick={() => onStatus("bloqueado")} className="btn mt-3 w-full bg-alerta-soft text-alerta hover:bg-alerta hover:text-white">
              Bloquear acesso
            </button>
          ) : (
            <button type="button" onClick={() => onStatus("ativo")} className="btn mt-3 w-full bg-folha-soft text-folha hover:bg-folha hover:text-white">
              Liberar acesso
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Alunos() {
  return (
    <Suspense fallback={<p className="text-ink-mute">Carregando…</p>}>
      <Lista />
    </Suspense>
  );
}
