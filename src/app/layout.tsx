import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Inventory Dashboard",
  description: "",
};

const navItems = [
  { name: "Dashboard", href: "/", icon: "Home" },
  { name: "Products", href: "/products", icon: "Warehouse" },
  { name: "Orders", href: "/orders", icon: "ShoppingCart" },
];

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0 }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div style={{ flexShrink: 0 }}>
            <Sidebar navItems={navItems} />
          </div>
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
