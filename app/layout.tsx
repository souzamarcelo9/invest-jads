import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Rota do Investidor | Demonstração",
  description: "Descubra seu perfil de investidor e acesse a carteira certa para o seu objetivo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E3B43",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
