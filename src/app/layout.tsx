import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anmol Kumar | Full Stack Developer",
  description:
    "Portfolio of Anmol Kumar — Full Stack Developer building modern and interactive web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  data-scroll-behavior="smooth"
>
      <body>{children}</body>
    </html>
  );
}