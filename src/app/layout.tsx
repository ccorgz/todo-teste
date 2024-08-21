import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProdProvider } from "@/providers/produtos.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teste Época",
  description: "Teste Época do Carlos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ProdProvider>{children}</ProdProvider>
      </body>
    </html>
  );
}
