"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BookOpen, Compass, Home, LogOut, MessageCircle, UserRound, Wallet } from "lucide-react";
import { useDemo } from "@/lib/store";
import { Logo } from "./Logo";
import { Disclaimer } from "./Disclaimer";
import { DemoBanner } from "./DemoBanner";

const NAV = [
  { href: "/app", rotulo: "Início", curto: "Início", icone: Home, mobile: true },
  { href: "/app/questionario", rotulo: "Questionário", curto: "Questionário", icone: Compass, mobile: false },
  { href: "/app/carteira", rotulo: "Minha carteira", curto: "Carteira", icone: Wallet, mobile: true },
  { href: "/app/assistente", rotulo: "Mentor virtual", curto: "Mentor", icone: MessageCircle, mobile: true },
  { href: "/app/aulas", rotulo: "Videoaulas", curto: "Aulas", icone: BookOpen, mobile: true },
  { href: "/app/perfil", rotulo: "Meu perfil", curto: "Perfil", icone: UserRound, mobile: true },
];

export function AlunoShell({ children }: { children: ReactNode }) {
  const { pronto, sessao, alunoAtual, sair } = useDemo();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (pronto && (sessao?.papel !== "aluno" || !alunoAtual || alunoAtual.status !== "ativo")) router.replace("/");
  }, [pronto, sessao, alunoAtual, router]);

  if (!pronto || !alunoAtual) {
    return <div className="grid min-h-screen place-items-center text-ink-mute">Carregando…</div>;
  }

  const ativo = (href: string) => (href === "/app" ? path === "/app" : path.startsWith(href));

  return (
    <div className="min-h-screen">
      <DemoBanner />
      <div className="mx-auto flex max-w-[1240px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col px-5 py-7 md:flex">
          <Link href="/app" aria-label="Início">
            <Logo />
          </Link>
          <nav className="mt-10 flex flex-col gap-1" aria-label="Navegação principal">
            {NAV.map(({ href, rotulo, icone: Icone }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-semibold transition-colors ${
                  ativo(href) ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
                }`}
              >
                <Icone size={19} strokeWidth={2.2} />
                {rotulo}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07]">
            <p className="truncate font-semibold">{alunoAtual.nome}</p>
            <p className="truncate text-sm text-ink-mute">{alunoAtual.email}</p>
            <button
              type="button"
              onClick={() => {
                sair();
                router.replace("/");
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-alerta"
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between px-5 py-4 md:hidden">
            <Logo />
            <button
              type="button"
              onClick={() => {
                sair();
                router.replace("/");
              }}
              aria-label="Sair"
              className="rounded-lg p-2 text-ink-soft"
            >
              <LogOut size={20} />
            </button>
          </header>
          <main className="px-5 pb-6 pt-2 md:px-8 md:pt-9">{children}</main>
          <Disclaimer />
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Navegação"
      >
        {NAV.filter((n) => n.mobile).map(({ href, curto, icone: Icone }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
              ativo(href) ? "text-ink" : "text-ink-mute"
            }`}
          >
            <Icone size={21} strokeWidth={ativo(href) ? 2.5 : 2} />
            {curto}
          </Link>
        ))}
      </nav>
    </div>
  );
}
