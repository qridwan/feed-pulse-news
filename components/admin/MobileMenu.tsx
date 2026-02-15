"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navItems = [
	{
		href: "/admin",
		label: "Dashboard",
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
			</svg>
		)
	},
	{
		href: "/admin/news",
		label: "News",
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
			</svg>
		)
	},
	{
		href: "/admin/sources",
		label: "Sources",
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
			</svg>
		)
	},
	{
		href: "/admin/storage",
		label: "Storage",
		icon: (
			<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
			</svg>
		)
	},
];

export function MobileMenu({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const pathname = usePathname();

	return (
		<aside
			className={clsx(
				"fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]",
				"bg-white border-r border-neutral-200",
				"pt-20 pb-6",
				"flex flex-col transition-transform duration-300 ease-out lg:hidden",
				open ? "translate-x-0" : "-translate-x-full"
			)}
			aria-label="Mobile navigation"
		>
			<div className="flex-1 flex flex-col px-4">
				{/* Navigation */}
				<nav className="flex-1 space-y-1" aria-label="Admin navigation">
					{navItems.map(({ href, label, icon }) => {
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
									"group flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200",
									isActive
										? "bg-neutral-900 text-white shadow-sm"
										: "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
								)}
							>
								<span className={clsx(
									"transition-colors duration-200",
									isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"
								)}>
									{icon}
								</span>
								{label}
							</Link>
						);
					})}
				</nav>

				{/* Logout Section */}
				<div className="pt-4 mt-4 border-t border-neutral-200">
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/admin/login" })}
						className="group w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-neutral-700 hover:bg-red-50 hover:text-red-700 active:bg-red-100 transition-all duration-200"
					>
						<svg className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
						</svg>
						Logout
					</button>
				</div>
			</div>
		</aside>
	);
}