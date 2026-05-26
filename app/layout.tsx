import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kim Tae-Sung | AI Content Creator & 3D Artist",
  description: "AI 콘텐츠 제작자이자 3D 아티스트 김태성의 포트폴리오. ComfyUI, Midjourney, Maya를 활용한 창의적인 작업들을 만나보세요.",
  keywords: ["3D Artist", "AI Creator", "ComfyUI", "Midjourney", "포트폴리오"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
