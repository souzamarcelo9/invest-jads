/**
 * SIMULAÇÃO do assistente para o protótipo.
 * Na versão final: perguntas simples e fora de escopo são resolvidas por regras (sem custo);
 * o restante vai para a API de IA com o prompt do admin + perfil do aluno + trechos da base de conhecimento.
 */
import { MENSAGEM_RECUSA } from "./data";
import { brl, OBJETIVO_LABEL, PERFIL_LABEL } from "./labels";
import type { Aluno, Aula, Carteira, MensagemChat } from "./types";

type Resposta = Omit<MensagemChat, "id" | "autor" | "hora">;

const FORA_ESCOPO = [
  "receita", "bolo", "futebol", "jogo", "programação", "programar", "python", "javascript",
  "saúde", "médico", "remédio", "dieta", "filme", "série", "novela", "música", "piada", "política",
  "eleição", "horóscopo", "redação", "tradução", "traduz",
];
const ANALISE = [
  "vale a pena comprar", "o que acha da", "o que acha do", "analisa", "analise minha", "petr", "vale3",
  "bitcoin", "cripto", "devo vender", "qual ação", "qual acao", "me recomenda", "minha carteira pessoal",
];

function tem(texto: string, termos: string[]) {
  return termos.some((t) => texto.includes(t));
}

function aula(aulas: Aula[], id: string) {
  const a = aulas.find((x) => x.id === id);
  return a ? { modulo: a.modulo, titulo: a.titulo, url: a.url } : undefined;
}

export function responder(entrada: string, aluno: Aluno | undefined, carteiras: Carteira[], aulas: Aula[]): Resposta {
  const t = entrada.toLowerCase();
  const r = aluno?.resultado;
  const carteira = r ? carteiras.find((c) => c.codigo === r.codigo) : undefined;
  const linkCarteira = carteira ? { rotulo: `Abrir Carteira ${carteira.codigo}`, href: "/app/carteira" } : undefined;

  if (tem(t, FORA_ESCOPO)) {
    return { texto: MENSAGEM_RECUSA, foraDeEscopo: true, semIA: true };
  }

  if (tem(t, ANALISE)) {
    return {
      texto:
        "Não faço análise de ativos específicos nem de carteiras montadas fora da metodologia. As recomendações estão prontas na sua carteira e são atualizadas pela equipe.\n\nSe quiser, posso explicar como os ativos da sua carteira foram escolhidos de acordo com o seu perfil.",
      link: linkCarteira,
      foraDeEscopo: true,
      semIA: true,
    };
  }

  if (!r) {
    return {
      texto:
        "Para eu te orientar de forma personalizada, primeiro preciso conhecer seu perfil. O questionário leva uns 3 minutos e você só precisa responder uma vez.",
      link: { rotulo: "Responder questionário", href: "/app/questionario" },
      semIA: true,
    };
  }

  if (tem(t, ["meu perfil", "qual minha carteira", "qual é minha carteira", "qual a minha carteira", "meu objetivo"])) {
    return {
      texto: `Seu perfil é ${PERFIL_LABEL[r.perfil].toLowerCase()} e seu objetivo é ${OBJETIVO_LABEL[r.objetivo].toLowerCase()}. Por isso, sua carteira é a ${r.codigo}${carteira ? ` (${carteira.nome})` : ""}.\n\nSe seus objetivos mudaram, você pode refazer o questionário a qualquer momento na aba Meu perfil.`,
      link: linkCarteira,
      semIA: true,
    };
  }

  if (tem(t, ["reserva", "emergência", "emergencia"])) {
    const falta = r.faltaReserva;
    return {
      texto:
        falta > 0
          ? `Pelo que você informou, seu custo de vida é de ${brl(r.custoVida)} por mês, então sua reserva ideal é de ${brl(r.reservaIdeal)}. Faltam ${brl(falta)} para completá-la.\n\nA reserva deve ficar em um investimento seguro e com resgate imediato, como o Tesouro Selic ou um CDB de liquidez diária. Completar a reserva vem antes da carteira.`
          : `Sua reserva de emergência já está completa: ${brl(r.reservaAtual)} guardados, acima dos ${brl(r.reservaIdeal)} recomendados. Agora seus aportes podem ir direto para a carteira ${r.codigo}.`,
      aula: aula(aulas, "l2"),
    };
  }

  if (tem(t, ["fundo imobili", "fundos imobili", "fii"])) {
    return {
      texto:
        "Fundo imobiliário (FII) é um investimento em que você compra cotas de um fundo que tem imóveis ou títulos ligados ao setor imobiliário. Em troca, recebe rendimentos, geralmente todo mês.\n\nPara comprar: entre no home broker da sua corretora, busque o código do fundo que está na sua carteira, informe a quantidade de cotas e confirme a ordem. A aula abaixo mostra cada clique.",
      aula: aula(aulas, "l7"),
      link: linkCarteira,
    };
  }

  if (tem(t, ["tesouro", "selic", "ipca"])) {
    return {
      texto:
        "O Tesouro Direto é um empréstimo que você faz ao governo federal em troca de juros. É considerado o investimento mais seguro do país.\n\nO Tesouro Selic acompanha a taxa básica de juros e é ótimo para a reserva de emergência. Os títulos IPCA+ protegem seu dinheiro da inflação no longo prazo.",
      aula: aula(aulas, "l4"),
    };
  }

  if (tem(t, ["cdb", "lci", "lca", "cdi"])) {
    return {
      texto:
        "CDB, LCI e LCA são empréstimos que você faz a bancos. O rendimento costuma ser um percentual do CDI (por exemplo, 100% do CDI).\n\nA principal diferença: LCI e LCA são isentas de imposto de renda para pessoa física, enquanto o CDB tem IR, que diminui quanto mais tempo o dinheiro fica aplicado.",
      aula: aula(aulas, "l5"),
    };
  }

  if (tem(t, ["dividendo", "provento"])) {
    return {
      texto:
        "Dividendos são a parte do lucro que uma empresa distribui aos acionistas. Quem tem a ação na data definida pela empresa recebe o valor direto na conta da corretora.",
      aula: aula(aulas, "l8"),
    };
  }

  if (tem(t, ["investir", "aporte", "aportar", "sobrou", "tenho mais", "r$", "reais"])) {
    const valor = entrada.match(/(\d{1,3}(\.\d{3})+|\d+)(,\d{2})?/);
    const v = valor ? ` de ${valor[0].includes(".") || Number(valor[0]) >= 100 ? "R$ " + valor[0] : valor[0]}` : "";
    const aviso =
      r.faltaReserva > 0
        ? `\n\nAntes, um lembrete: ainda faltam ${brl(r.faltaReserva)} para completar sua reserva de emergência. Pela metodologia, o ideal é direcionar esse valor para a reserva primeiro.`
        : "";
    return {
      texto: `Ótimo! Como seu perfil é ${PERFIL_LABEL[r.perfil].toLowerCase()} com foco em ${OBJETIVO_LABEL[r.objetivo].toLowerCase()}, esse aporte${v} deve seguir a Carteira ${r.codigo}.\n\nAbra sua carteira, informe o valor na calculadora e ela mostra exatamente quanto colocar em cada ativo. Não precisa fazer conta nenhuma.${aviso}`,
      link: linkCarteira,
      aula: aula(aulas, "l9"),
    };
  }

  if (tem(t, ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"]) && t.length < 25) {
    return {
      texto: `Olá, ${aluno?.nome.split(" ")[0]}! Sou seu mentor virtual. Posso tirar dúvidas sobre investimentos, sobre a sua Carteira ${r.codigo} e indicar a aula certa para cada assunto. Como posso ajudar?`,
      semIA: true,
    };
  }

  return {
    texto:
      "Boa pergunta! Na versão final, esta resposta será gerada pela IA com base na metodologia e nos materiais cadastrados no painel administrativo, sempre de forma curta e indicando a aula relacionada.\n\nNesta demonstração, experimente perguntar sobre reserva de emergência, fundos imobiliários, Tesouro Direto ou um novo aporte.",
  };
}

export const SUGESTOES = [
  "Tenho mais R$ 1.000 para investir. O que faço?",
  "Como compro um fundo imobiliário?",
  "Quanto preciso ter de reserva de emergência?",
  "Me passa uma receita de bolo",
];
