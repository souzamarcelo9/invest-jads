export function Disclaimer({ claro = false }: { claro?: boolean }) {
  return (
    <footer
      className={`mx-auto max-w-4xl px-5 pb-24 pt-10 text-center text-[13px] leading-relaxed md:pb-10 ${
        claro ? "text-white/60" : "text-ink-mute"
      }`}
    >
      <p>
        Conteúdo de caráter exclusivamente educacional e informativo. As estratégias e carteiras apresentadas não
        constituem recomendação individual de investimento. Investimentos envolvem riscos, inclusive de perda do capital
        investido, e rentabilidade passada não é garantia de rentabilidade futura. Avalie sua situação antes de investir.
      </p>
      <p className="mt-2 opacity-80">© 2026 Rota do Investidor. Ambiente de demonstração com dados fictícios.</p>
    </footer>
  );
}
