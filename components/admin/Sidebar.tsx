"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/news", label: "News Management" },
  { href: "/admin/sources", label: "Source Management" },
  { href: "/admin/storage", label: "Storage" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30",
        "w-64 bg-white/80 backdrop-blur-xl border-r border-neutral-200/80",
        "pt-16 pb-6 px-4 transition-all duration-200"
      )}
    >
      <nav className="flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map(({ href, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx(
                "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-neutral-200/80">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
