# Rota do Investidor: protótipo navegável

Protótipo da plataforma para apresentação ao cliente. Feito com **Next.js 14 (App Router), TypeScript e Tailwind CSS**.
Nesta versão **não há banco de dados**: todos os dados são fictícios (`lib/data.ts`) e as alterações feitas na demonstração
ficam salvas apenas no navegador de quem está testando (botão "Restaurar dados" no topo volta ao estado inicial).

## Rodar localmente

```bash
npm install
npm run dev
# abra http://localhost:3000
```

## Publicar no Vercel

1. Suba esta pasta para um repositório no GitHub.
2. No Vercel: **Add New → Project → Import** o repositório.
3. Framework detectado: Next.js. Não é preciso configurar variáveis de ambiente. Clique em **Deploy**.

Ou pela linha de comando: `npx vercel` dentro da pasta.

## Como demonstrar

| Acesso | Como entrar |
|---|---|
| Aluna com perfil pronto | `ana@exemplo.com`, código `123456` |
| Primeiro acesso (faz o questionário) | `novo@exemplo.com`, código `123456` |
| Compra reembolsada (acesso negado) | `eduarda@exemplo.com` |
| E-mail sem compra (acesso negado) | qualquer outro e-mail |
| Painel administrativo | link "Abrir o painel administrativo" na tela de login |

Roteiro sugerido: login com `novo@exemplo.com` → questionário → resultado (com orientação de reserva) → carteira em aba
interna → mentor virtual ("Tenho mais R$ 1.000 para investir", "Me passa uma receita de bolo") → painel admin.

## O que é real e o que é simulado

| Recurso | No protótipo | Na versão final |
|---|---|---|
| Regras do questionário (`lib/quiz.ts`) | **Lógica real**, reaproveitável | Igual, com pesos configuráveis |
| Login por código | Código fixo `123456` | Supabase Auth (OTP por e-mail) |
| Liberação/bloqueio por compra | Lista fictícia de alunos | Rotas `/api/webhooks/hotmart` e `/api/webhooks/payt` |
| Limite de dispositivos | Apenas visual | Tabela de sessões + verificação no middleware |
| Mentor virtual (`lib/assistente.ts`) | Respostas por palavras-chave | Filtro por regras + API de IA com prompt, perfil e base de conhecimento |
| Carteira em aba interna | `iframe` para `/demo-carteira/[codigo]` | `iframe` para o site do cliente, via rota protegida |
| Painel admin | Edita dados no navegador | Grava no Supabase |

## Estrutura

```
app/
  page.tsx                 Login (e-mail + código)
  app/                     Área do aluno: início, questionário, resultado, carteira, mentor, aulas, perfil
  admin/                   Painel: visão geral, alunos, links das carteiras, mentor, aulas, consumo da IA, acessos
  demo-carteira/[codigo]/  Simulação do site externo do cliente (fora do escopo real)
components/                Layouts, matriz das 9 carteiras, aviso legal
lib/
  quiz.ts                  Perguntas, pontuação, perfil, objetivo, código da carteira e reserva de emergência
  assistente.ts            Simulação do mentor virtual
  data.ts                  Dados fictícios
  store.tsx                Estado da demonstração
```

## Regras do questionário

- 5 perguntas de perfil valem de 1 a 3 pontos cada: até 8 pontos = conservador, 9 a 12 = moderado, 13 a 15 = arrojado.
- 2 perguntas de objetivo: respostas iguais definem o objetivo; respostas diferentes resultam em "renda + crescimento".
- Código: letra do perfil (C, M, A) + número do objetivo (1 multiplicação, 2 renda mensal, 3 renda + crescimento).
- Reserva ideal = 6 × custo de vida mensal. Se a reserva atual for menor, o resultado mostra a orientação antes da carteira.
