/**
 * Lógica do questionário — 100% programação tradicional, sem IA.
 * Este arquivo já pode ser reaproveitado na versão final.
 */
import type { Objetivo, Perfil, Respostas, ResultadoPerfil } from "./types";

export type TipoPergunta = "opcoes" | "valor";

export interface Opcao {
  valor: string;
  texto: string;
  pontos?: number; // pontuação de perfil (1 a 3)
  objetivo?: Objetivo; // voto de objetivo
}

export interface Pergunta {
  id: string;
  bloco: "perfil" | "objetivo" | "financeiro";
  tipo: TipoPergunta;
  titulo: string;
  ajuda?: string;
  opcoes?: Opcao[];
  placeholder?: string;
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: "queda",
    bloco: "perfil",
    tipo: "opcoes",
    titulo: "Se seus investimentos caíssem 15% em um mês, o que você faria?",
    opcoes: [
      { valor: "vende", texto: "Venderia tudo para não perder mais", pontos: 1 },
      { valor: "espera", texto: "Ficaria preocupado, mas esperaria recuperar", pontos: 2 },
      { valor: "compra", texto: "Aproveitaria para comprar mais barato", pontos: 3 },
    ],
  },
  {
    id: "conhecimento",
    bloco: "perfil",
    tipo: "opcoes",
    titulo: "Como você descreve seu conhecimento sobre investimentos hoje?",
    opcoes: [
      { valor: "nenhum", texto: "Estou começando agora", pontos: 1 },
      { valor: "basico", texto: "Já investi na poupança ou em renda fixa", pontos: 2 },
      { valor: "intermediario", texto: "Já investi em ações ou fundos imobiliários", pontos: 3 },
    ],
  },
  {
    id: "prazo",
    bloco: "perfil",
    tipo: "opcoes",
    titulo: "Por quanto tempo você pretende deixar esse dinheiro investido?",
    opcoes: [
      { valor: "ate2", texto: "Até 2 anos", pontos: 1 },
      { valor: "2a5", texto: "De 2 a 5 anos", pontos: 2 },
      { valor: "mais5", texto: "Mais de 5 anos", pontos: 3 },
    ],
  },
  {
    id: "risco",
    bloco: "perfil",
    tipo: "opcoes",
    titulo: "Qual frase combina mais com você?",
    opcoes: [
      { valor: "seguranca", texto: "Prefiro segurança, mesmo ganhando menos", pontos: 1 },
      { valor: "equilibrio", texto: "Quero equilíbrio entre segurança e retorno", pontos: 2 },
      { valor: "retorno", texto: "Aceito oscilações em busca de mais retorno", pontos: 3 },
    ],
  },
  {
    id: "renda_estavel",
    bloco: "perfil",
    tipo: "opcoes",
    titulo: "Como é a sua renda hoje?",
    opcoes: [
      { valor: "instavel", texto: "Varia bastante de um mês para o outro", pontos: 1 },
      { valor: "estavel", texto: "É estável, mas sobra pouco", pontos: 2 },
      { valor: "sobra", texto: "É estável e sobra dinheiro todo mês", pontos: 3 },
    ],
  },
  {
    id: "objetivo_principal",
    bloco: "objetivo",
    tipo: "opcoes",
    titulo: "O que você mais quer que o seu dinheiro faça?",
    opcoes: [
      { valor: "crescer", texto: "Cresça o máximo possível ao longo dos anos", objetivo: "multiplicacao" },
      { valor: "pagar", texto: "Me pague uma renda todo mês", objetivo: "renda" },
      { valor: "ambos", texto: "Um pouco dos dois", objetivo: "renda_crescimento" },
    ],
  },
  {
    id: "futuro",
    bloco: "objetivo",
    tipo: "opcoes",
    titulo: "Daqui a 10 anos, como você se imagina?",
    opcoes: [
      { valor: "patrimonio", texto: "Com um patrimônio grande para usar depois", objetivo: "multiplicacao" },
      { valor: "viver_renda", texto: "Vivendo dos rendimentos dos investimentos", objetivo: "renda" },
      { valor: "renda_extra", texto: "Com renda extra e patrimônio ainda crescendo", objetivo: "renda_crescimento" },
    ],
  },
  {
    id: "custo_vida",
    bloco: "financeiro",
    tipo: "valor",
    titulo: "Quanto você gasta por mês, em média, com seu custo de vida?",
    ajuda: "Some aluguel, contas, mercado, transporte e outras despesas fixas.",
    placeholder: "3.500",
  },
  {
    id: "reserva_atual",
    bloco: "financeiro",
    tipo: "valor",
    titulo: "Quanto você já tem guardado como reserva de emergência?",
    ajuda: "Dinheiro que você consegue resgatar a qualquer momento. Se não tem, informe 0.",
    placeholder: "0",
  },
  {
    id: "capital",
    bloco: "financeiro",
    tipo: "valor",
    titulo: "Quanto você tem disponível para investir agora?",
    ajuda: "Sem contar a reserva de emergência.",
    placeholder: "10.000",
  },
  {
    id: "aporte",
    bloco: "financeiro",
    tipo: "valor",
    titulo: "Quanto você consegue investir todo mês?",
    placeholder: "500",
  },
];

/** Meses de custo de vida que formam a reserva ideal (configurável no admin futuramente). */
export const MESES_RESERVA = 6;

const PRAZO_LABEL: Record<string, string> = {
  ate2: "Até 2 anos",
  "2a5": "De 2 a 5 anos",
  mais5: "Mais de 5 anos",
};

export function perfilPorPontuacao(pontos: number): Perfil {
  if (pontos <= 8) return "conservador";
  if (pontos <= 12) return "moderado";
  return "arrojado";
}

export function codigoCarteira(perfil: Perfil, objetivo: Objetivo): string {
  const letra = { conservador: "C", moderado: "M", arrojado: "A" }[perfil];
  const numero = { multiplicacao: 1, renda: 2, renda_crescimento: 3 }[objetivo];
  return `${letra}${numero}`;
}

export function calcularResultado(r: Respostas): ResultadoPerfil {
  let pontuacao = 0;
  const votos: Objetivo[] = [];

  for (const p of PERGUNTAS) {
    if (p.tipo !== "opcoes") continue;
    const op = p.opcoes?.find((o) => o.valor === r[p.id]);
    if (!op) continue;
    if (op.pontos) pontuacao += op.pontos;
    if (op.objetivo) votos.push(op.objetivo);
  }

  // Duas respostas iguais definem o objetivo; respostas diferentes indicam o equilíbrio entre os dois.
  const objetivo: Objetivo = votos.length === 2 && votos[0] === votos[1] ? votos[0] : "renda_crescimento";
  const perfil = perfilPorPontuacao(pontuacao);

  const custoVida = Number(r.custo_vida) || 0;
  const reservaAtual = Number(r.reserva_atual) || 0;
  const reservaIdeal = custoVida * MESES_RESERVA;

  return {
    perfil,
    objetivo,
    codigo: codigoCarteira(perfil, objetivo),
    pontuacao,
    custoVida,
    reservaAtual,
    reservaIdeal,
    faltaReserva: Math.max(0, reservaIdeal - reservaAtual),
    capital: Number(r.capital) || 0,
    aporteMensal: Number(r.aporte) || 0,
    prazo: PRAZO_LABEL[String(r.prazo)] ?? "—",
  };
}
