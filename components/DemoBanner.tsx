"use client";

import { useDemo } from "@/lib/store";

export function DemoBanner() {
  const { resetarDemo } = useDemo();
  return (
    <div className="bg-ouro-soft px-4 py-1.5 text-center text-[13px] text-ouro-deep">
      Protótipo para apresentação: os dados são fictícios e ficam salvos só neste navegador.{" "}
      <button
        type="button"
        onClick={() => {
          if (confirm("Restaurar todos os dados de exemplo?")) resetarDemo();
        }}
        className="font-semibold underline underline-offset-2"
      >
        Restaurar dados
      </button>
    </div>
  );
}
