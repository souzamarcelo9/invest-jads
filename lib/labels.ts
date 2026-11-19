import type { Objetivo, Perfil, StatusAcesso } from "./types";

export const PERFIL_LABEL: Record<Perfil, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  arrojado: "Arrojado",
};

export const OBJETIVO_LABEL: Record<Objetivo, string> = {
  multiplicacao: "Multiplicação de capital",
  renda: "Geração de renda mensal",
  renda_crescimento: "Renda mensal + crescimento",
};

export const OBJETIVO_CURTO: Record<Objetivo, string> = {
  multiplicacao: "Multiplicação",
  renda: "Renda mensal",
  renda_crescimento: "Renda + crescimento",
};

export const PERFIL_COR: Record<Perfil, string> = {
  conservador: "bg-conservador",
  moderado: "bg-moderado",
  arrojado: "bg-arrojado",
};

export const PERFIL_TEXTO: Record<Perfil, string> = {
  conservador: "text-conservador",
  moderado: "text-moderado",
  arrojado: "text-arrojado",
};

export const STATUS_LABEL: Record<StatusAcesso, string> = {
  ativo: "Ativo",
  bloqueado: "Bloqueado manualmente",
  reembolsado: "Reembolsado",
  chargeback: "Chargeback",
};

export const PERFIS: Perfil[] = ["conservador", "moderado", "arrojado"];
export const OBJETIVOS: Objetivo[] = ["multiplicacao", "renda", "renda_crescimento"];

export const PERFIL_EXPLICACAO: Record<Perfil, string> = {
  conservador:
    "Você valoriza segurança e previsibilidade. Prefere ver o dinheiro crescer com calma a correr o risco de grandes oscilações.",
  moderado:
    "Você busca equilíbrio: aceita algumas oscilações em troca de um retorno melhor, sem abrir mão de uma base sólida.",
  arrojado:
    "Você entende que oscilações fazem parte do caminho e está disposto a enfrentá-las em busca de um crescimento maior no longo prazo.",
};

export const OBJETIVO_EXPLICACAO: Record<Objetivo, string> = {
  multiplicacao:
    "Seu foco é fazer o patrimônio crescer. Os rendimentos são reinvestidos para acelerar o efeito dos juros compostos.",
  renda:
    "Seu foco é receber dinheiro todo mês. A carteira prioriza ativos que pagam rendimentos de forma recorrente.",
  renda_crescimento:
    "Você quer o melhor dos dois: uma renda mensal hoje e um patrimônio que continua crescendo para o futuro.",
};

export function brl(valor: number, casas = 0) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export function dataBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
