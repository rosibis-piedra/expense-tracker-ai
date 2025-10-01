import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "Track your expenses, analyze spending patterns, and manage your personal finances effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}
