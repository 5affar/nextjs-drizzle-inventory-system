"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

export default function Sidebar({ navItems }: { navItems: { name: string; href: string, icon: string }[] }) {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-100 w-64 min-h-screen p-6 border-r border-gray-200">
      <div className="flex items-center gap-2 mb-8 content-center">
        <span className="font-bold text-lg text-gray-800 px-3 py-5">Inventory App</span>
      </div>

      <nav>
        <ul className="space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const LucideIcon = Icons[item.icon as keyof typeof Icons] as React.ComponentType<LucideProps>;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${isActive? "bg-blue-100 text-blue-600 font-semibold": "text-gray-700 hover:bg-gray-100"}`}
                >
                  {LucideIcon ? <LucideIcon className="mr-2" /> : null}
                  <div className="inline-block align-middle">{item.name}</div>
                  
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
