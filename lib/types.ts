export type Perfil = "conservador" | "moderado" | "arrojado";
export type Objetivo = "multiplicacao" | "renda" | "renda_crescimento";
export type StatusAcesso = "ativo" | "bloqueado" | "reembolsado" | "chargeback";
export type Plataforma = "Hotmart" | "PayT";

export interface Respostas {
  [perguntaId: string]: string | number;
}

export interface ResultadoPerfil {
  perfil: Perfil;
  objetivo: Objetivo;
  codigo: string; // C1..A3
  pontuacao: number;
  custoVida: number;
  reservaAtual: number;
  reservaIdeal: number;
  faltaReserva: number;
  capital: number;
  aporteMensal: number;
  prazo: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  plataforma: Plataforma;
  status: StatusAcesso;
  compradoEm: string;
  ultimoAcesso: string;
  sessoesAtivas: number;
  mensagensIA: number;
  custoIA: number; // em R$
  resultado?: ResultadoPerfil;
}

export interface Carteira {
  codigo: string;
  perfil: Perfil;
  objetivo: Objetivo;
  nome: string;
  url: string;
  atualizadaEm: string;
}

export interface Aula {
  id: string;
  modulo: string;
  titulo: string;
  url: string;
  palavrasChave: string[];
  duracao: string;
}

export interface ItemConhecimento {
  id: string;
  titulo: string;
  conteudo: string;
  atualizadoEm: string;
}

export interface MensagemChat {
  id: string;
  autor: "aluno" | "assistente";
  texto: string;
  link?: { rotulo: string; href: string };
  aula?: { modulo: string; titulo: string; url: string };
  foraDeEscopo?: boolean;
  semIA?: boolean; // respondido por regra, sem consumir créditos
  hora: string;
}

export interface EventoWebhook {
  id: string;
  plataforma: Plataforma;
  evento: string;
  email: string;
  recebidoEm: string;
  acao: string;
}
