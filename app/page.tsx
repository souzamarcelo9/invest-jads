"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";
import { CONTAS_DEMO } from "@/lib/data";
import { useDemo } from "@/lib/store";

const CODIGO_DEMO = "123456";

export default function Login() {
  const { verificarEmail, entrar, entrarAdmin, alunos, sessao, pronto } = useDemo();
  const router = useRouter();
  const [etapa, setEtapa] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [espera, setEspera] = useState(0);
  const codigoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pronto) return;
    if (sessao?.papel === "aluno") router.replace("/app");
    if (sessao?.papel === "admin") router.replace("/admin");
  }, [pronto, sessao, router]);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const aluno = alunos.find((a) => a.email === email.trim().toLowerCase());

  function enviarCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);
    const r = verificarEmail(email);
    if (r === "sem_compra") {
      setErro(
        "Não encontramos uma compra aprovada com este e-mail. Use o mesmo e-mail da compra na Hotmart ou PayT. Se o problema continuar, fale com o suporte.",
      );
      return;
    }
    if (r === "bloqueado") {
      setErro("O acesso deste e-mail está suspenso porque a compra foi reembolsada ou contestada. Fale com o suporte se acreditar que é um engano.");
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEtapa("codigo");
      setEspera(45);
      setTimeout(() => codigoRef.current?.focus(), 50);
    }, 700);
  }

  function confirmarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (codigo !== CODIGO_DEMO) {
      setErro("Código incorreto. Confira o e-mail mais recente que enviamos ou peça um novo código.");
      return;
    }
    entrar(email);
    router.push("/app");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-ink px-6 py-8 text-white sm:px-10 lg:min-h-screen lg:py-12">
        <Logo claro />
        <div className="my-10 max-w-lg lg:my-0">
          <h1 className="text-[2.1rem] font-extrabold leading-[1.08] sm:text-5xl">
            Saiba que investidor você é. Receba a carteira feita para o seu objetivo.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/75">
            Um questionário rápido, uma das 9 carteiras da metodologia e um mentor virtual para tirar suas dúvidas a
            qualquer hora.
          </p>
        </div>
        <div className="hidden max-w-xs grid-cols-3 gap-2 lg:grid" aria-hidden="true">
          {["C1", "C2", "C3", "M1", "M2", "M3", "A1", "A2", "A3"].map((c) => (
            <div
              key={c}
              className={`grid h-16 place-items-center rounded-xl font-display text-xl font-extrabold ${
                c === "M2" ? "bg-ouro text-ink" : "bg-white/[0.07] text-white/40"
              }`}
            >
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col">
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {etapa === "email" ? (
              <form onSubmit={enviarCodigo} noValidate>
                <h2 className="text-3xl font-bold">Entrar na plataforma</h2>
                <p className="mt-2 text-ink-mute">
                  Informe o e-mail usado na compra. Enviaremos um código de acesso, sem precisar de senha.
                </p>
                <label htmlFor="email" className="rotulo mt-7">
                  E-mail da compra
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" size={19} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="campo pl-11"
                  />
                </div>
                {erro && (
                  <p role="alert" className="mt-3 rounded-xl bg-alerta-soft px-4 py-3 text-sm text-alerta">
                    {erro}
                  </p>
                )}
                <button type="submit" disabled={!email.includes("@") || enviando} className="btn-primario mt-5 w-full">
                  {enviando ? "Enviando código…" : "Receber código por e-mail"}
                </button>

                <div className="mt-9 rounded-2xl border border-dashed border-ink/20 p-4">
                  <p className="text-sm font-semibold">Contas de demonstração</p>
                  <ul className="mt-2 space-y-1.5">
                    {CONTAS_DEMO.map((c) => (
                      <li key={c.email}>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(c.email);
                            setErro(null);
                          }}
                          className="text-left text-sm"
                        >
                          <span className="font-semibold text-ink underline decoration-ouro decoration-2 underline-offset-2">
                            {c.email}
                          </span>
                          <span className="text-ink-mute">: {c.descricao}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      entrarAdmin();
                      router.push("/admin");
                    }}
                    className="mt-3 text-sm font-semibold text-ink-soft underline underline-offset-2"
                  >
                    Abrir o painel administrativo
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={confirmarCodigo}>
                <button
                  type="button"
                  onClick={() => {
                    setEtapa("email");
                    setCodigo("");
                    setErro(null);
                  }}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft"
                >
                  <ArrowLeft size={16} /> Trocar e-mail
                </button>
                <h2 className="text-3xl font-bold">Digite o código</h2>
                <p className="mt-2 text-ink-mute">
                  Enviamos um código de 6 dígitos para <strong className="text-ink">{email}</strong>. Ele vale por 10
                  minutos.
                </p>
                <label htmlFor="codigo" className="rotulo mt-7">
                  Código de acesso
                </label>
                <input
                  ref={codigoRef}
                  id="codigo"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value.replace(/\D/g, ""));
                    setErro(null);
                  }}
                  className="campo text-center font-display text-3xl font-bold tracking-[0.5em]"
                  placeholder="······"
                />
                <p className="mt-2 text-sm text-ink-mute">
                  Na demonstração, use o código <strong className="text-ink">{CODIGO_DEMO}</strong>.
                </p>
                {aluno && aluno.sessoesAtivas >= 2 && (
                  <p className="mt-3 flex gap-2 rounded-xl bg-ouro-soft px-4 py-3 text-sm text-ouro-deep">
                    <ShieldCheck size={18} className="shrink-0" />
                    Esta conta já está conectada em 2 dispositivos. Ao entrar, o acesso mais antigo será encerrado.
                  </p>
                )}
                {erro && (
                  <p role="alert" className="mt-3 rounded-xl bg-alerta-soft px-4 py-3 text-sm text-alerta">
                    {erro}
                  </p>
                )}
                <button type="submit" disabled={codigo.length !== 6} className="btn-primario mt-5 w-full">
                  Entrar
                </button>
                <button
                  type="button"
                  disabled={espera > 0}
                  onClick={() => {
                    setEspera(45);
                    setErro(null);
                  }}
                  className="mt-4 w-full text-center text-sm font-semibold text-ink-soft disabled:text-ink-mute/70"
                >
                  {espera > 0 ? `Reenviar código em ${espera}s` : "Reenviar código"}
                </button>
              </form>
            )}
            <p className="mt-10 text-center text-sm text-ink-mute">
              Ainda não é aluno?{" "}
              <Link href="#" className="font-semibold text-ink underline underline-offset-2">
                Conheça o programa
              </Link>
            </p>
          </div>
        </div>
        <Disclaimer />
      </section>
    </div>
  );
}
