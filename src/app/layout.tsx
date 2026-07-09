import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RemitX | Send Money Smarter, Cheaper, Faster",
  description: "RemitX leverages the Stellar Network to deliver instant cross-border settlements with lower fees than traditional banking.",
  icons: {
    icon: "/image/Remitx.png",
    shortcut: "/image/Remitx.png",
    apple: "/image/Remitx.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-body-md text-on-background bg-background min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}