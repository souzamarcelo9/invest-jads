/** Dados fictícios para o protótipo. Na versão final, tudo isto vem do Supabase. */
import { codigoCarteira, MESES_RESERVA } from "./quiz";
import type { Aluno, Aula, Carteira, EventoWebhook, ItemConhecimento, Objetivo, Perfil, ResultadoPerfil } from "./types";
import { OBJETIVOS, OBJETIVO_CURTO, PERFIS, PERFIL_LABEL } from "./labels";

function res(
  perfil: Perfil,
  objetivo: Objetivo,
  custoVida: number,
  reservaAtual: number,
  capital: number,
  aporteMensal: number,
  prazo: string,
): ResultadoPerfil {
  const reservaIdeal = custoVida * MESES_RESERVA;
  return {
    perfil,
    objetivo,
    codigo: codigoCarteira(perfil, objetivo),
    pontuacao: perfil === "conservador" ? 7 : perfil === "moderado" ? 10 : 14,
    custoVida,
    reservaAtual,
    reservaIdeal,
    faltaReserva: Math.max(0, reservaIdeal - reservaAtual),
    capital,
    aporteMensal,
    prazo,
  };
}

export const ALUNOS: Aluno[] = [
  { id: "a1", nome: "Ana Ribeiro", email: "ana@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-09-02", ultimoAcesso: "2026-11-19", sessoesAtivas: 1, mensagensIA: 42, custoIA: 0.71, resultado: res("moderado", "renda", 4200, 26000, 18000, 800, "Mais de 5 anos") },
  { id: "a2", nome: "Bruno Carvalho", email: "bruno.c@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-09-05", ultimoAcesso: "2026-11-18", sessoesAtivas: 2, mensagensIA: 118, custoIA: 1.94, resultado: res("arrojado", "multiplicacao", 6500, 40000, 250000, 5000, "Mais de 5 anos") },
  { id: "a3", nome: "Carla Mendes", email: "carla.m@exemplo.com", plataforma: "PayT", status: "ativo", compradoEm: "2026-09-11", ultimoAcesso: "2026-11-17", sessoesAtivas: 1, mensagensIA: 9, custoIA: 0.15, resultado: res("conservador", "renda", 3000, 2000, 5000, 300, "De 2 a 5 anos") },
  { id: "a4", nome: "Diego Nascimento", email: "diego.n@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-09-14", ultimoAcesso: "2026-11-15", sessoesAtivas: 1, mensagensIA: 31, custoIA: 0.52, resultado: res("moderado", "renda_crescimento", 5200, 32000, 85000, 2000, "Mais de 5 anos") },
  { id: "a5", nome: "Eduarda Lima", email: "eduarda@exemplo.com", plataforma: "Hotmart", status: "reembolsado", compradoEm: "2026-09-20", ultimoAcesso: "2026-09-24", sessoesAtivas: 0, mensagensIA: 4, custoIA: 0.06, resultado: res("conservador", "multiplicacao", 2800, 0, 1500, 200, "Até 2 anos") },
  { id: "a6", nome: "Fernando Alves", email: "fernando.a@exemplo.com", plataforma: "PayT", status: "ativo", compradoEm: "2026-09-28", ultimoAcesso: "2026-11-19", sessoesAtivas: 1, mensagensIA: 64, custoIA: 1.05, resultado: res("arrojado", "renda_crescimento", 9000, 60000, 420000, 8000, "Mais de 5 anos") },
  { id: "a7", nome: "Gabriela Rocha", email: "gabi.rocha@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-10-01", ultimoAcesso: "2026-11-12", sessoesAtivas: 1, mensagensIA: 12, custoIA: 0.2, resultado: res("moderado", "multiplicacao", 3800, 10000, 12000, 600, "De 2 a 5 anos") },
  { id: "a8", nome: "Henrique Souza", email: "henrique@exemplo.com", plataforma: "Hotmart", status: "chargeback", compradoEm: "2026-10-03", ultimoAcesso: "2026-10-10", sessoesAtivas: 0, mensagensIA: 210, custoIA: 3.4, resultado: res("arrojado", "multiplicacao", 4000, 5000, 3000, 300, "Mais de 5 anos") },
  { id: "a9", nome: "Isabela Martins", email: "isabela@exemplo.com", plataforma: "PayT", status: "ativo", compradoEm: "2026-10-09", ultimoAcesso: "2026-11-18", sessoesAtivas: 1, mensagensIA: 27, custoIA: 0.44, resultado: res("conservador", "renda_crescimento", 7000, 45000, 150000, 3000, "De 2 a 5 anos") },
  { id: "a10", nome: "João Pedro Dias", email: "joao.dias@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-10-15", ultimoAcesso: "2026-11-16", sessoesAtivas: 1, mensagensIA: 0, custoIA: 0 },
  { id: "a11", nome: "Larissa Teixeira", email: "larissa.t@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-10-21", ultimoAcesso: "2026-11-19", sessoesAtivas: 1, mensagensIA: 53, custoIA: 0.87, resultado: res("moderado", "renda", 5500, 35000, 95000, 2500, "Mais de 5 anos") },
  { id: "a12", nome: "Marcos Vieira", email: "marcos.v@exemplo.com", plataforma: "PayT", status: "bloqueado", compradoEm: "2026-10-25", ultimoAcesso: "2026-11-02", sessoesAtivas: 0, mensagensIA: 380, custoIA: 6.12, resultado: res("arrojado", "renda", 3500, 21000, 20000, 1000, "De 2 a 5 anos") },
  { id: "a13", nome: "Natália Freitas", email: "natalia@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-11-03", ultimoAcesso: "2026-11-19", sessoesAtivas: 1, mensagensIA: 18, custoIA: 0.29, resultado: res("conservador", "multiplicacao", 3200, 19200, 30000, 700, "Mais de 5 anos") },
  { id: "a14", nome: "Otávio Pereira", email: "otavio.p@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-11-10", ultimoAcesso: "2026-11-18", sessoesAtivas: 1, mensagensIA: 6, custoIA: 0.1, resultado: res("moderado", "renda_crescimento", 4800, 8000, 7000, 400, "De 2 a 5 anos") },
  { id: "a15", nome: "Novo Aluno (demo)", email: "novo@exemplo.com", plataforma: "Hotmart", status: "ativo", compradoEm: "2026-11-19", ultimoAcesso: "2026-11-19", sessoesAtivas: 0, mensagensIA: 0, custoIA: 0 },
];

const NOMES_CARTEIRA: Record<string, string> = {
  C1: "Crescimento Seguro",
  C2: "Renda Tranquila",
  C3: "Base Equilibrada",
  M1: "Crescimento Constante",
  M2: "Renda Mensal Moderada",
  M3: "Renda & Patrimônio",
  A1: "Multiplicação Acelerada",
  A2: "Renda Turbo",
  A3: "Patrimônio em Expansão",
};

export const CARTEIRAS: Carteira[] = PERFIS.flatMap((p) =>
  OBJETIVOS.map((o) => {
    const codigo = codigoCarteira(p, o);
    return {
      codigo,
      perfil: p,
      objetivo: o,
      nome: NOMES_CARTEIRA[codigo],
      // Na demonstração, os links apontam para uma página que simula o site externo do cliente.
      url: `/demo-carteira/${codigo}`,
      atualizadaEm: "2026-11-14",
    };
  }),
);

export function nomeCompletoCarteira(c: Carteira) {
  return `${PERFIL_LABEL[c.perfil]}, ${OBJETIVO_CURTO[c.objetivo].toLowerCase()}`;
}

export const AULAS: Aula[] = [
  { id: "l1", modulo: "Módulo 1: Primeiros passos", titulo: "Por que investir e não só poupar", url: "https://cursos.exemplo.com/m1/a1", palavrasChave: ["poupança", "começar", "iniciante"], duracao: "12 min" },
  { id: "l2", modulo: "Módulo 1: Primeiros passos", titulo: "Como montar sua reserva de emergência", url: "https://cursos.exemplo.com/m1/a2", palavrasChave: ["reserva", "emergência", "liquidez"], duracao: "15 min" },
  { id: "l3", modulo: "Módulo 1: Primeiros passos", titulo: "Abrindo conta na corretora", url: "https://cursos.exemplo.com/m1/a3", palavrasChave: ["corretora", "conta", "abrir"], duracao: "9 min" },
  { id: "l4", modulo: "Módulo 2: Renda fixa", titulo: "Tesouro Direto na prática", url: "https://cursos.exemplo.com/m2/a1", palavrasChave: ["tesouro", "selic", "ipca"], duracao: "18 min" },
  { id: "l5", modulo: "Módulo 2: Renda fixa", titulo: "CDB, LCI e LCA sem complicação", url: "https://cursos.exemplo.com/m2/a2", palavrasChave: ["cdb", "lci", "lca", "cdi"], duracao: "14 min" },
  { id: "l6", modulo: "Módulo 3: Fundos imobiliários", titulo: "O que são fundos imobiliários", url: "https://cursos.exemplo.com/m3/a1", palavrasChave: ["fii", "fundo imobiliário", "fundos imobiliários"], duracao: "16 min" },
  { id: "l7", modulo: "Módulo 3: Fundos imobiliários", titulo: "Passo a passo: comprando seu primeiro FII", url: "https://cursos.exemplo.com/m3/a2", palavrasChave: ["comprar fii", "home broker", "comprar"], duracao: "11 min" },
  { id: "l8", modulo: "Módulo 4: Ações", titulo: "Como funcionam os dividendos", url: "https://cursos.exemplo.com/m4/a1", palavrasChave: ["dividendos", "proventos", "ações"], duracao: "13 min" },
  { id: "l9", modulo: "Módulo 5: Usando sua carteira", titulo: "Como usar a calculadora da carteira", url: "https://cursos.exemplo.com/m5/a1", palavrasChave: ["calculadora", "aporte", "distribuir"], duracao: "7 min" },
  { id: "l10", modulo: "Módulo 5: Usando sua carteira", titulo: "Rebalanceamento: quando e como fazer", url: "https://cursos.exemplo.com/m5/a2", palavrasChave: ["rebalancear", "rebalanceamento"], duracao: "10 min" },
];

export const CONHECIMENTO: ItemConhecimento[] = [
  { id: "k1", titulo: "Metodologia: os 3 perfis", conteudo: "Explica as características dos perfis conservador, moderado e arrojado e como o questionário os identifica.", atualizadoEm: "2026-11-02" },
  { id: "k2", titulo: "Metodologia: os 3 objetivos", conteudo: "Multiplicação de capital, geração de renda mensal e renda + crescimento. Quando cada um faz sentido.", atualizadoEm: "2026-11-02" },
  { id: "k3", titulo: "Reserva de emergência", conteudo: "A reserva ideal equivale a 6 meses de custo de vida, aplicada em ativos com liquidez diária.", atualizadoEm: "2026-10-28" },
  { id: "k4", titulo: "Como fazer novos aportes", conteudo: "Sempre usar a calculadora da carteira para distribuir o valor do aporte entre os ativos.", atualizadoEm: "2026-11-10" },
  { id: "k5", titulo: "Perguntas frequentes da plataforma", conteudo: "Login por código, refazer questionário, acesso às aulas, suporte.", atualizadoEm: "2026-11-12" },
];

export const PROMPT_PADRAO = `Você é o mentor virtual da plataforma Rota do Investidor.
Responda sempre em português, de forma simples, em no máximo 4 parágrafos curtos.

Você PODE:
- Explicar conceitos de investimento da metodologia.
- Usar o perfil, objetivo e código de carteira do aluno (fornecidos no contexto).
- Indicar o link da carteira do aluno e a videoaula mais relacionada.

Você NÃO PODE:
- Analisar mercado, ativos específicos ou carteiras pessoais do aluno.
- Montar carteiras, recomendar ativos ou alterar as recomendações da metodologia.
- Falar de assuntos fora de investimentos e da plataforma.

Se a pergunta estiver fora do escopo, responda com a mensagem padrão de recusa.`;

export const MENSAGEM_RECUSA =
  "Fui desenvolvido para entender seus objetivos, ajudar você a aplicar nossa metodologia de investimentos e utilizar os recursos disponíveis na plataforma. Por isso, não realizo análises ou orientações fora desse contexto e não falo de assuntos externos que não tenham ligação com investimentos. Posso ajudar com alguma dúvida relacionada à sua carteira ou ao conteúdo do seu programa?";

export const LIMITES_IA = {
  mensagensPorDia: 30,
  mensagensPorMes: 400,
  maxTokensResposta: 400,
  historicoEnviado: 6, // últimas mensagens enviadas como contexto
  modelo: "Modelo econômico (ex.: Claude Haiku / GPT mini)",
};

export const WEBHOOKS: EventoWebhook[] = [
  { id: "w1", plataforma: "Hotmart", evento: "PURCHASE_APPROVED", email: "novo@exemplo.com", recebidoEm: "2026-11-19T09:12:00", acao: "Acesso liberado" },
  { id: "w2", plataforma: "Hotmart", evento: "PURCHASE_APPROVED", email: "otavio.p@exemplo.com", recebidoEm: "2026-11-10T14:40:00", acao: "Acesso liberado" },
  { id: "w3", plataforma: "Hotmart", evento: "PURCHASE_APPROVED", email: "natalia@exemplo.com", recebidoEm: "2026-11-03T20:05:00", acao: "Acesso liberado" },
  { id: "w4", plataforma: "PayT", evento: "compra_aprovada", email: "marcos.v@exemplo.com", recebidoEm: "2026-10-25T11:22:00", acao: "Acesso liberado" },
  { id: "w5", plataforma: "Hotmart", evento: "PURCHASE_CHARGEBACK", email: "henrique@exemplo.com", recebidoEm: "2026-10-12T08:31:00", acao: "Acesso bloqueado" },
  { id: "w6", plataforma: "Hotmart", evento: "PURCHASE_REFUNDED", email: "eduarda@exemplo.com", recebidoEm: "2026-09-25T16:47:00", acao: "Acesso bloqueado" },
];

/** Consumo de IA dos últimos 14 dias (fictício). */
export const CONSUMO_DIARIO = [
  { dia: "06/11", mensagens: 61, custo: 0.98 },
  { dia: "07/11", mensagens: 74, custo: 1.19 },
  { dia: "08/11", mensagens: 38, custo: 0.6 },
  { dia: "09/11", mensagens: 29, custo: 0.47 },
  { dia: "10/11", mensagens: 92, custo: 1.48 },
  { dia: "11/11", mensagens: 88, custo: 1.41 },
  { dia: "12/11", mensagens: 103, custo: 1.66 },
  { dia: "13/11", mensagens: 97, custo: 1.55 },
  { dia: "14/11", mensagens: 81, custo: 1.3 },
  { dia: "15/11", mensagens: 44, custo: 0.7 },
  { dia: "16/11", mensagens: 39, custo: 0.63 },
  { dia: "17/11", mensagens: 112, custo: 1.8 },
  { dia: "18/11", mensagens: 126, custo: 2.02 },
  { dia: "19/11", mensagens: 58, custo: 0.93 },
];

export const CONTAS_DEMO = [
  { email: "ana@exemplo.com", descricao: "Aluna que já fez o questionário" },
  { email: "novo@exemplo.com", descricao: "Primeiro acesso, sem questionário" },
  { email: "eduarda@exemplo.com", descricao: "Compra reembolsada (acesso bloqueado)" },
];
