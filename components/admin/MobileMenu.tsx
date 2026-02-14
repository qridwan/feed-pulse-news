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

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]",
        "bg-white/95 backdrop-blur-xl border-r border-neutral-200/80",
        "pt-20 pb-6 px-4",
        "flex flex-col transition-transform duration-200 ease-out lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Mobile navigation"
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
              onClick={onClose}
              className={clsx(
                "rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 touch-manipulation",
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-100"
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
          className="w-full rounded-xl px-4 py-3.5 text-left text-base font-medium text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 touch-manipulation active:bg-red-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
