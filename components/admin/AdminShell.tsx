"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { MobileMenu } from "@/components/admin/MobileMenu";
import type { User } from "next-auth";

export function AdminShell({
	user,
	children,
}: {
	user: User;
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-neutral-50">
			{/* Mobile Menu */}
			<MobileMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			{/* Header */}
			<Header user={user} onMenuClick={() => setSidebarOpen(true)} />

			{/* Main Layout */}
			<div className="flex">
				{/* Desktop Sidebar */}
				<Sidebar onNavigate={() => setSidebarOpen(false)} />

				{/* Main Content */}
				<main className="flex-1 lg:ml-64 pt-18 lg:pt-20 transition-all duration-300">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
						{children}
					</div>
				</main>
			</div>

			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
					aria-hidden="true"
				/>
			)}
		</div>
	);
}