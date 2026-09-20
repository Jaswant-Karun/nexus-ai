// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nexus AI',
  description: 'Next.js application for Nexus AI platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
