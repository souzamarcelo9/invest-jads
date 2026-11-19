"use client";

/**
 * SIMULAÇÃO da página externa de carteira (que o cliente já possui).
 * Existe apenas para a demonstração mostrar como o site externo aparece dentro da plataforma.
 */
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type Ativo = { nome: string; classe: string; pct: number; risco: "Baixo" | "Médio" | "Alto"; preco: string };

const BASE: Record<string, Ativo[]> = {
  C: [
    { nome: "Tesouro Selic", classe: "Renda fixa pública", pct: 35, risco: "Baixo", preco: "R$ 16.420,00" },
    { nome: "Tesouro IPCA+ 2035", classe: "Renda fixa pública", pct: 25, risco: "Baixo", preco: "R$ 2.180,00" },
    { nome: "CDB banco grande (exemplo)", classe: "Renda fixa privada", pct: 20, risco: "Baixo", preco: "R$ 1,00" },
    { nome: "LCI 95% CDI (exemplo)", classe: "Renda fixa isenta", pct: 15, risco: "Baixo", preco: "R$ 1,00" },
    { nome: "FII de recebíveis (exemplo)", classe: "Fundo imobiliário", pct: 5, risco: "Médio", preco: "R$ 98,40" },
  ],
  M: [
    { nome: "Tesouro IPCA+ 2035", classe: "Renda fixa pública", pct: 25, risco: "Baixo", preco: "R$ 2.180,00" },
    { nome: "CDB 110% CDI (exemplo)", classe: "Renda fixa privada", pct: 15, risco: "Baixo", preco: "R$ 1,00" },
    { nome: "FII de logística (exemplo)", classe: "Fundo imobiliário", pct: 20, risco: "Médio", preco: "R$ 104,10" },
    { nome: "FII de recebíveis (exemplo)", classe: "Fundo imobiliário", pct: 15, risco: "Médio", preco: "R$ 98,40" },
    { nome: "Ação setor elétrico (exemplo)", classe: "Ações", pct: 15, risco: "Médio", preco: "R$ 41,25" },
    { nome: "ETF de índice global (exemplo)", classe: "ETF", pct: 10, risco: "Alto", preco: "R$ 318,90" },
  ],
  A: [
    { nome: "Tesouro IPCA+ 2045", classe: "Renda fixa pública", pct: 10, risco: "Médio", preco: "R$ 1.020,00" },
    { nome: "FII de shoppings (exemplo)", classe: "Fundo imobiliário", pct: 15, risco: "Médio", preco: "R$ 87,60" },
    { nome: "Ação banco (exemplo)", classe: "Ações", pct: 20, risco: "Alto", preco: "R$ 33,80" },
    { nome: "Ação varejo (exemplo)", classe: "Ações", pct: 15, risco: "Alto", preco: "R$ 12,15" },
    { nome: "Ação tecnologia (exemplo)", classe: "Ações", pct: 20, risco: "Alto", preco: "R$ 58,30" },
    { nome: "ETF de índice global (exemplo)", classe: "ETF", pct: 20, risco: "Alto", preco: "R$ 318,90" },
  ],
};

const COR_RISCO = { Baixo: "#2F8F6B", Médio: "#C98A12", Alto: "#B83A4B" };

export default function PaginaExternaCarteira() {
  const { codigo } = useParams<{ codigo: string }>();
  const cod = String(codigo ?? "M2").toUpperCase();
  const ativos = BASE[cod[0]] ?? BASE.M;
  const [valor, setValor] = useState("1000");
  const total = Number(valor.replace(/\D/g, "")) || 0;
  const linhas = useMemo(() => ativos.map((a) => ({ ...a, valor: (total * a.pct) / 100 })), [ativos, total]);

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", background: "#fff", color: "#1d2a2e", minHeight: "100vh" }}>
      <div style={{ background: "#1d2a2e", color: "#fff", padding: "14px 20px", fontSize: 14 }}>
        Site externo de carteiras (simulação) | Carteira {cod}
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 40px" }}>
        <h1 style={{ fontSize: 30, margin: 0 }}>Carteira {cod}</h1>
        <p style={{ color: "#5b6b70", marginTop: 6 }}>Composição atualizada pela equipe. Valores e preços fictícios.</p>

        <div style={{ marginTop: 22, padding: 18, border: "1px solid #dfe5e6", borderRadius: 12, background: "#f7faf9" }}>
          <label htmlFor="valor" style={{ fontWeight: 700, fontFamily: "system-ui, sans-serif", fontSize: 15 }}>
            Quanto você vai investir?
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>R$</span>
            <input
              id="valor"
              inputMode="numeric"
              value={total ? total.toLocaleString("pt-BR") : ""}
              onChange={(e) => setValor(e.target.value)}
              style={{ fontSize: 22, padding: "8px 12px", border: "1px solid #c7d1d3", borderRadius: 8, width: 200 }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 22 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "system-ui, sans-serif", fontSize: 15, minWidth: 560 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5b6b70", borderBottom: "2px solid #1d2a2e" }}>
                <th style={{ padding: "8px 6px" }}>Ativo</th>
                <th style={{ padding: "8px 6px" }}>Risco</th>
                <th style={{ padding: "8px 6px" }}>Preço ref.</th>
                <th style={{ padding: "8px 6px", textAlign: "right" }}>%</th>
                <th style={{ padding: "8px 6px", textAlign: "right" }}>Investir</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.nome} style={{ borderBottom: "1px solid #e6ebec" }}>
                  <td style={{ padding: "10px 6px" }}>
                    <strong>{l.nome}</strong>
                    <div style={{ color: "#7a888c", fontSize: 13 }}>{l.classe}</div>
                  </td>
                  <td style={{ padding: "10px 6px", color: COR_RISCO[l.risco], fontWeight: 700 }}>{l.risco}</td>
                  <td style={{ padding: "10px 6px" }}>{l.preco}</td>
                  <td style={{ padding: "10px 6px", textAlign: "right" }}>{l.pct}%</td>
                  <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 700 }}>
                    {l.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 18, color: "#7a888c", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
          Esta página representa o site que o cliente já possui. Ela não faz parte do escopo da plataforma.
        </p>
      </div>
    </div>
  );
}
