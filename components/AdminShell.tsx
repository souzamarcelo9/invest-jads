"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Bot, ChartColumn, KeyRound, LayoutGrid, LogOut, Menu, PlaySquare, Users, Wallet, X } from "lucide-react";
import { useDemo } from "@/lib/store";
import { Logo } from "./Logo";
import { DemoBanner } from "./DemoBanner";

const NAV = [
  { href: "/admin", rotulo: "Visão geral", icone: LayoutGrid },
  { href: "/admin/alunos", rotulo: "Alunos", icone: Users },
  { href: "/admin/carteiras", rotulo: "Links das carteiras", icone: Wallet },
  { href: "/admin/assistente", rotulo: "Mentor virtual", icone: Bot },
  { href: "/admin/aulas", rotulo: "Videoaulas", icone: PlaySquare },
  { href: "/admin/consumo", rotulo: "Consumo da IA", icone: ChartColumn },
  { href: "/admin/acessos", rotulo: "Acessos e compras", icone: KeyRound },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { pronto, sessao, sair } = useDemo();
  const router = useRouter();
  const path = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (pronto && sessao?.papel !== "admin") router.replace("/");
  }, [pronto, sessao, router]);

  useEffect(() => setAberto(false), [path]);

  if (!pronto || sessao?.papel !== "admin") {
    return <div className="grid min-h-screen place-items-center text-ink-mute">Carregando…</div>;
  }

  const ativo = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  const menu = (
    <>
      <nav className="mt-8 flex flex-col gap-1" aria-label="Administração">
        {NAV.map(({ href, rotulo, icone: Icone }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-semibold transition-colors ${
              ativo(href) ? "bg-white text-ink" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icone size={19} />
            {rotulo}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 text-sm text-white/70">
        <p className="font-semibold text-white">Administrador</p>
        <p>admin@rotadoinvestidor.com</p>
        <button
          type="button"
          onClick={() => {
            sair();
            router.replace("/");
          }}
          className="mt-3 inline-flex items-center gap-1.5 font-semibold text-white/80 hover:text-white"
        >
          <LogOut size={15} /> Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen">
      <DemoBanner />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink px-5 py-7 lg:flex">
          <Logo claro />
          <span className="mt-2 text-sm text-white/60">Painel administrativo</span>
          {menu}
        </aside>

        {aberto && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-ink/40" onClick={() => setAberto(false)} />
            <aside className="relative flex h-full w-72 flex-col bg-ink px-5 py-7">
              <div className="flex items-center justify-between">
                <Logo claro />
                <button type="button" aria-label="Fechar menu" onClick={() => setAberto(false)} className="text-white">
                  <X />
                </button>
              </div>
              {menu}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="flex items-center gap-3 border-b border-ink/10 bg-white px-5 py-3 lg:hidden">
            <button type="button" aria-label="Abrir menu" onClick={() => setAberto(true)} className="text-ink">
              <Menu />
            </button>
            <Logo compacto />
            <span className="font-display font-bold">Painel</span>
          </header>
          <main className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function TituloPagina({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.9rem] font-bold leading-tight">{titulo}</h1>
        {descricao && <p className="mt-1 max-w-2xl text-ink-mute">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
