import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma de Climatização",
  description: "Área de Ensino e Formação Técnica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`}>
        {children}
        {/* Componente responsável por exibir as notificações flutuantes */}
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}