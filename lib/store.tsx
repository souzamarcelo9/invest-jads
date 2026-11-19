"use client";

/**
 * Estado global da DEMONSTRAÇÃO (em memória + localStorage do navegador).
 * Na versão final cada ação abaixo vira uma chamada ao Supabase / rotas de API.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALUNOS, AULAS, CARTEIRAS, CONHECIMENTO, LIMITES_IA, MENSAGEM_RECUSA, PROMPT_PADRAO, WEBHOOKS } from "./data";
import { calcularResultado } from "./quiz";
import type { Aluno, Aula, Carteira, EventoWebhook, ItemConhecimento, MensagemChat, Respostas, StatusAcesso } from "./types";

type Sessao = { papel: "aluno"; email: string } | { papel: "admin"; email: string } | null;

interface Estado {
  sessao: Sessao;
  alunos: Aluno[];
  carteiras: Carteira[];
  aulas: Aula[];
  conhecimento: ItemConhecimento[];
  prompt: string;
  recusa: string;
  limites: typeof LIMITES_IA;
  chats: Record<string, MensagemChat[]>;
  usoHoje: Record<string, number>;
  webhooks: EventoWebhook[];
  respostas: Record<string, Respostas>;
}

const INICIAL: Estado = {
  sessao: null,
  alunos: ALUNOS,
  carteiras: CARTEIRAS,
  aulas: AULAS,
  conhecimento: CONHECIMENTO,
  prompt: PROMPT_PADRAO,
  recusa: MENSAGEM_RECUSA,
  limites: LIMITES_IA,
  chats: {
    "ana@exemplo.com": [
      { id: "h1", autor: "aluno", texto: "O que é liquidez diária?", hora: "18/11 20:14" },
      {
        id: "h2",
        autor: "assistente",
        texto:
          "Liquidez diária significa que você pode resgatar o dinheiro em qualquer dia útil, sem esperar o vencimento. É a característica mais importante para a reserva de emergência.",
        aula: { modulo: "Módulo 1: Primeiros passos", titulo: "Como montar sua reserva de emergência", url: "https://cursos.exemplo.com/m1/a2" },
        hora: "18/11 20:14",
      },
    ],
  },
  usoHoje: { "ana@exemplo.com": 3 },
  webhooks: WEBHOOKS,
  respostas: {},
};

const CHAVE = "rota-investidor-demo-v1";

export type VerificacaoEmail = "ok" | "sem_compra" | "bloqueado";

interface Ctx extends Estado {
  pronto: boolean;
  alunoAtual?: Aluno;
  verificarEmail: (email: string) => VerificacaoEmail;
  entrar: (email: string) => void;
  entrarAdmin: () => void;
  sair: () => void;
  salvarQuestionario: (r: Respostas) => void;
  adicionarMensagens: (email: string, msgs: MensagemChat[]) => void;
  registrarUsoIA: (email: string) => void;
  atualizarCarteira: (codigo: string, url: string) => void;
  definirStatus: (id: string, status: StatusAcesso) => void;
  corrigirEmail: (id: string, novoEmail: string) => void;
  liberarManual: (nome: string, email: string) => void;
  encerrarSessoes: (id: string) => void;
  salvarAulas: (a: Aula[]) => void;
  salvarConhecimento: (k: ItemConhecimento[]) => void;
  salvarAssistente: (prompt: string, recusa: string, limites: typeof LIMITES_IA) => void;
  resetarDemo: () => void;
}

const Contexto = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(INICIAL);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setEstado({ ...INICIAL, ...JSON.parse(salvo) });
    } catch {
      /* armazenamento indisponível: segue com os dados iniciais */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* ignora */
    }
  }, [estado, pronto]);

  const atualizarAluno = useCallback((filtro: (a: Aluno) => boolean, fn: (a: Aluno) => Aluno) => {
    setEstado((s) => ({ ...s, alunos: s.alunos.map((a) => (filtro(a) ? fn(a) : a)) }));
  }, []);

  const verificarEmail = useCallback(
    (email: string): VerificacaoEmail => {
      const a = estado.alunos.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!a) return "sem_compra";
      if (a.status !== "ativo") return "bloqueado";
      return "ok";
    },
    [estado.alunos],
  );

  const valor = useMemo<Ctx>(() => {
    const alunoAtual =
      estado.sessao?.papel === "aluno" ? estado.alunos.find((a) => a.email === estado.sessao!.email) : undefined;

    return {
      ...estado,
      pronto,
      alunoAtual,
      verificarEmail,
      entrar: (email) => {
        const e = email.trim().toLowerCase();
        setEstado((s) => ({
          ...s,
          sessao: { papel: "aluno", email: e },
          alunos: s.alunos.map((a) =>
            a.email === e
              ? { ...a, ultimoAcesso: new Date().toISOString().slice(0, 10), sessoesAtivas: Math.min(2, a.sessoesAtivas + 1) }
              : a,
          ),
        }));
      },
      entrarAdmin: () => setEstado((s) => ({ ...s, sessao: { papel: "admin", email: "admin@rotadoinvestidor.com" } })),
      sair: () => setEstado((s) => ({ ...s, sessao: null })),
      salvarQuestionario: (r) => {
        const email = estado.sessao?.email;
        if (!email) return;
        const resultado = calcularResultado(r);
        setEstado((s) => ({
          ...s,
          respostas: { ...s.respostas, [email]: r },
          alunos: s.alunos.map((a) => (a.email === email ? { ...a, resultado } : a)),
        }));
      },
      adicionarMensagens: (email, msgs) =>
        setEstado((s) => ({ ...s, chats: { ...s.chats, [email]: [...(s.chats[email] ?? []), ...msgs] } })),
      registrarUsoIA: (email) => {
        setEstado((s) => ({ ...s, usoHoje: { ...s.usoHoje, [email]: (s.usoHoje[email] ?? 0) + 1 } }));
        atualizarAluno(
          (a) => a.email === email,
          (a) => ({ ...a, mensagensIA: a.mensagensIA + 1, custoIA: +(a.custoIA + 0.016).toFixed(3) }),
        );
      },
      atualizarCarteira: (codigo, url) =>
        setEstado((s) => ({
          ...s,
          carteiras: s.carteiras.map((c) =>
            c.codigo === codigo ? { ...c, url, atualizadaEm: new Date().toISOString().slice(0, 10) } : c,
          ),
        })),
      definirStatus: (id, status) =>
        atualizarAluno((a) => a.id === id, (a) => ({ ...a, status, sessoesAtivas: status === "ativo" ? a.sessoesAtivas : 0 })),
      corrigirEmail: (id, novoEmail) => atualizarAluno((a) => a.id === id, (a) => ({ ...a, email: novoEmail.trim().toLowerCase() })),
      liberarManual: (nome, email) =>
        setEstado((s) => ({
          ...s,
          alunos: [
            {
              id: `m${Date.now()}`,
              nome,
              email: email.trim().toLowerCase(),
              plataforma: "Hotmart",
              status: "ativo",
              compradoEm: new Date().toISOString().slice(0, 10),
              ultimoAcesso: "—",
              sessoesAtivas: 0,
              mensagensIA: 0,
              custoIA: 0,
            },
            ...s.alunos,
          ],
          webhooks: [
            {
              id: `w${Date.now()}`,
              plataforma: "Hotmart",
              evento: "LIBERAÇÃO MANUAL",
              email: email.trim().toLowerCase(),
              recebidoEm: new Date().toISOString(),
              acao: "Acesso liberado pelo admin",
            },
            ...s.webhooks,
          ],
        })),
      encerrarSessoes: (id) => atualizarAluno((a) => a.id === id, (a) => ({ ...a, sessoesAtivas: 0 })),
      salvarAulas: (aulas) => setEstado((s) => ({ ...s, aulas })),
      salvarConhecimento: (conhecimento) => setEstado((s) => ({ ...s, conhecimento })),
      salvarAssistente: (prompt, recusa, limites) => setEstado((s) => ({ ...s, prompt, recusa, limites })),
      resetarDemo: () => setEstado({ ...INICIAL, sessao: estado.sessao }),
    };
  }, [estado, pronto, verificarEmail, atualizarAluno]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDemo() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useDemo precisa estar dentro de <DemoProvider>");
  return c;
}
