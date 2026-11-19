"use client";

import { useState } from "react";
import { FileUp, Plus, Trash2 } from "lucide-react";
import { TituloPagina } from "@/components/AdminShell";
import { useDemo } from "@/lib/store";
import { dataBR } from "@/lib/labels";

export default function AdminAssistente() {
  const { prompt, recusa, limites, conhecimento, salvarAssistente, salvarConhecimento } = useDemo();
  const [p, setP] = useState(prompt);
  const [rec, setRec] = useState(recusa);
  const [lim, setLim] = useState(limites);
  const [itens, setItens] = useState(conhecimento);
  const [aviso, setAviso] = useState<string | null>(null);

  function salvar() {
    salvarAssistente(p, rec, lim);
    salvarConhecimento(itens);
    setAviso("Configurações salvas. As próximas conversas já usam as novas instruções.");
    setTimeout(() => setAviso(null), 3500);
  }

  return (
    <>
      <TituloPagina
        titulo="Mentor virtual"
        descricao="Instruções, limites e materiais que o assistente usa para responder aos alunos."
        acao={
          <button type="button" onClick={salvar} className="btn-primario">
            Salvar alterações
          </button>
        }
      />
      {aviso && <p className="mb-5 rounded-xl bg-folha-soft px-4 py-3 text-folha">{aviso}</p>}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="painel">
          <label htmlFor="prompt" className="font-display text-lg font-bold">
            Instruções do mentor
          </label>
          <p className="mt-1 text-sm text-ink-mute">
            Define o tom, o que ele pode e o que não pode responder. O perfil, o objetivo e a carteira do aluno são incluídos
            automaticamente em cada conversa.
          </p>
          <textarea id="prompt" value={p} onChange={(e) => setP(e.target.value)} rows={16} className="campo mt-3 font-mono text-sm leading-relaxed" />
          <label htmlFor="recusa" className="mt-5 block font-display text-lg font-bold">
            Mensagem para perguntas fora do escopo
          </label>
          <textarea id="recusa" value={rec} onChange={(e) => setRec(e.target.value)} rows={5} className="campo mt-3 text-[15px]" />
        </section>

        <section className="painel h-fit">
          <h2 className="font-display text-lg font-bold">Limites de uso</h2>
          <p className="mt-1 text-sm text-ink-mute">Controlam o custo e evitam uso abusivo.</p>
          <div className="mt-4 space-y-4">
            {(
              [
                ["mensagensPorDia", "Perguntas por aluno, por dia"],
                ["mensagensPorMes", "Perguntas por aluno, por mês"],
                ["maxTokensResposta", "Tamanho máximo da resposta (tokens)"],
                ["historicoEnviado", "Mensagens anteriores enviadas como contexto"],
              ] as const
            ).map(([k, rotulo]) => (
              <div key={k}>
                <label htmlFor={k} className="rotulo">
                  {rotulo}
                </label>
                <input
                  id={k}
                  type="number"
                  min={1}
                  value={lim[k]}
                  onChange={(e) => setLim({ ...lim, [k]: Number(e.target.value) })}
                  className="campo py-2.5"
                />
              </div>
            ))}
            <div>
              <p className="rotulo">Modelo de IA</p>
              <p className="rounded-xl bg-paper px-4 py-2.5 text-[15px]">{lim.modelo}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="painel mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Base de conhecimento</h2>
            <p className="mt-1 text-sm text-ink-mute">Textos da metodologia que o mentor consulta antes de responder.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" disabled title="Disponível na versão final" className="btn-linha py-2.5 text-sm">
              <FileUp size={16} /> Enviar PDF
            </button>
            <button
              type="button"
              onClick={() =>
                setItens([{ id: `k${Date.now()}`, titulo: "Novo tópico", conteudo: "", atualizadoEm: new Date().toISOString() }, ...itens])
              }
              className="btn-ouro py-2.5 text-sm"
            >
              <Plus size={16} /> Adicionar tópico
            </button>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {itens.map((k, i) => (
            <div key={k.id} className="rounded-2xl bg-paper p-4">
              <div className="flex items-center gap-2">
                <input
                  aria-label="Título do tópico"
                  value={k.titulo}
                  onChange={(e) => setItens(itens.map((x, j) => (j === i ? { ...x, titulo: e.target.value } : x)))}
                  className="flex-1 bg-transparent font-display text-lg font-bold focus:outline-none"
                />
                <span className="hidden text-sm text-ink-mute sm:inline">Atualizado em {dataBR(k.atualizadoEm)}</span>
                <button
                  type="button"
                  aria-label={`Remover ${k.titulo}`}
                  onClick={() => setItens(itens.filter((_, j) => j !== i))}
                  className="rounded-lg p-1.5 text-ink-mute hover:bg-white hover:text-alerta"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <textarea
                aria-label="Conteúdo do tópico"
                value={k.conteudo}
                rows={2}
                onChange={(e) => setItens(itens.map((x, j) => (j === i ? { ...x, conteudo: e.target.value } : x)))}
                placeholder="Escreva aqui o conteúdo que o mentor deve saber sobre este tópico."
                className="campo mt-2 bg-white py-2.5 text-[15px]"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
