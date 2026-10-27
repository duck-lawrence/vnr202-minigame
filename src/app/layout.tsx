import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bản đồ thời cơ | Mini board game lịch sử",
  description:
    "Mini board game ôn tập lịch sử Việt Nam 1939–1945 dành cho lớp học.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
