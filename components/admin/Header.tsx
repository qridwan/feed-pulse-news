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
		<header className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-neutral-200 transition-all duration-300">
			<div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Left Side */}
				<div className="flex items-center gap-3 lg:gap-4">
					{/* Mobile Menu Button */}
					<button
						type="button"
						aria-label="Open menu"
						className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
						onClick={onMenuClick}
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					</button>

					{/* Logo/Brand */}
					<Link
						href="/admin"
						className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-lg"
					>
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 shadow-sm group-hover:shadow transition-shadow">
							<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
							</svg>
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg lg:text-xl font-semibold tracking-tight text-neutral-900">
								BD 2.0 Archives
							</h1>
							<p className="text-xs text-neutral-500">Admin Dashboard</p>
						</div>
					</Link>
				</div>

				{/* Right Side */}
				<div className="flex items-center gap-2 sm:gap-3">
					{/* User Info */}
					<div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-100">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white text-sm font-semibold">
							{user.email?.charAt(0).toUpperCase() || "A"}
						</div>
						<span className="text-sm font-medium text-neutral-700 truncate max-w-[150px]">
							{user.email}
						</span>
					</div>

					{/* Logout Button - Desktop */}
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/admin/login" })}
						className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
						</svg>
						<span className="hidden lg:inline">Logout</span>
					</button>

					{/* Logout Button - Mobile (Icon Only) */}
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/admin/login" })}
						className="sm:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
						aria-label="Logout"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
						</svg>
					</button>
				</div>
			</div>
		</header>
	);
}