"use client";

import { codigoCarteira } from "@/lib/quiz";
import { OBJETIVOS, OBJETIVO_CURTO, PERFIS, PERFIL_LABEL } from "@/lib/labels";
import type { Perfil } from "@/lib/types";

const TOM: Record<Perfil, { base: string; ativo: string; borda: string }> = {
  conservador: { base: "bg-conservador/10 text-conservador", ativo: "bg-conservador text-white", borda: "ring-conservador" },
  moderado: { base: "bg-moderado/10 text-moderado", ativo: "bg-moderado text-white", borda: "ring-moderado" },
  arrojado: { base: "bg-arrojado/10 text-arrojado", ativo: "bg-arrojado text-white", borda: "ring-arrojado" },
};

/**
 * O "mapa" das 9 carteiras. Modo destaque (aluno) acende a célula do resultado;
 * modo contagem (admin) mostra quantos alunos há em cada combinação.
 */
export function MatrizCarteiras({
  destaque,
  contagens,
  onSelecionar,
  compacta = false,
}: {
  destaque?: string;
  contagens?: Record<string, number>;
  onSelecionar?: (codigo: string) => void;
  compacta?: boolean;
}) {
  const max = contagens ? Math.max(1, ...Object.values(contagens)) : 1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-separate border-spacing-1.5">
        <thead>
          <tr>
            <th className="w-[26%]" />
            {OBJETIVOS.map((o) => (
              <th key={o} scope="col" className="px-1 pb-1 text-left align-bottom text-xs font-semibold leading-tight text-ink-mute sm:text-sm">
                {OBJETIVO_CURTO[o]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERFIS.map((p) => (
            <tr key={p}>
              <th scope="row" className="pr-1 text-left text-xs font-semibold text-ink-soft sm:text-sm">
                {PERFIL_LABEL[p]}
              </th>
              {OBJETIVOS.map((o) => {
                const codigo = codigoCarteira(p, o);
                const ativo = destaque === codigo;
                const n = contagens ? (contagens[codigo] ?? 0) : undefined;
                const intensidade = n !== undefined ? 0.12 + (n / max) * 0.88 : undefined;
                const Tag = onSelecionar ? "button" : "div";
                return (
                  <td key={o} className="p-0">
                    <Tag
                      {...(onSelecionar ? { type: "button" as const, onClick: () => onSelecionar(codigo) } : {})}
                      className={`relative flex w-full flex-col justify-between rounded-xl text-left transition ${
                        compacta ? "h-14 p-2" : "h-[4.6rem] p-2.5 sm:h-20 sm:p-3"
                      } ${
                        ativo
                          ? `${TOM[p].ativo} animar-acender shadow-lg ring-4 ring-offset-2 ${TOM[p].borda}`
                          : n !== undefined
                            ? (intensidade ?? 0) > 0.45
                              ? "text-white"
                              : "text-ink"
                            : destaque
                              ? "bg-paper-deep/70 text-ink-mute/60"
                              : TOM[p].base
                      } ${onSelecionar ? "hover:ring-2 hover:ring-ink/30" : ""}`}
                      style={
                        intensidade !== undefined
                          ? { backgroundColor: `rgba(14, 59, 67, ${intensidade.toFixed(2)})` }
                          : undefined
                      }
                    >
                      <span className={`font-display font-extrabold leading-none ${compacta ? "text-lg" : "text-xl sm:text-2xl"}`}>
                        {codigo}
                      </span>
                      {n !== undefined && (
                        <span className="text-xs font-semibold opacity-90">
                          {n} {n === 1 ? "aluno" : "alunos"}
                        </span>
                      )}
                      {ativo && <span className="text-xs font-semibold">Sua carteira</span>}
                    </Tag>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
