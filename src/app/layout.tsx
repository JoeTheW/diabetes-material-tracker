import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ApproveModalProvider } from "@/components/modals/ApproveModal/ApproveModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diabetes material tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApproveModalProvider>
        <div className="mx-auto max-w-5xl text-2xl mb-10">
          <header className="mb-2">
            <Navbar />
          </header>
          <main>
            {children}
          </main>
        </div>
        </ApproveModalProvider>
      </body>
    </html>
  );
}
