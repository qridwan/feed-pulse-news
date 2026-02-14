"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { User } from "next-auth";

export function Header({
	user,
	onMenuClick,
}: {
	user: User;
	onMenuClick: () => void;
}) {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-14 lg:h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 transition-all duration-200">
			<div className="h-full flex items-center justify-between px-4 lg:px-8">
				<div className="flex items-center gap-4">
					<button
						type="button"
						aria-label="Open menu"
						className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors touch-manipulation"
						onClick={onMenuClick}
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<Link
						href="/admin"
						className="text-lg lg:text-xl font-semibold tracking-tight text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded-lg"
					>
						BD 2.0 Archives
					</Link>
				</div>
				<div className="flex items-center gap-3">
					<span
						className="hidden sm:block text-sm text-neutral-500 truncate max-w-[180px]"
						title={user.email ?? undefined}
					>
						{user.email}
					</span>
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/admin/login" })}
						className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
