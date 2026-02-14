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
		<div className="min-h-screen bg-[#f5f5f7] text-neutral-900">
			<MobileMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<Header user={user} onMenuClick={() => setSidebarOpen(true)} />
			<div className="flex gap-4">
				<Sidebar onNavigate={() => setSidebarOpen(false)} />
				<main className="flex-1 lg:pl-64 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)] pt-14 lg:pt-16 px-4 lg:px-8 pb-8 transition-all duration-200">
					{children}
				</main>
			</div>
			{/* Overlay when mobile menu is open */}
			{sidebarOpen && (
				<button
					type="button"
					aria-label="Close menu"
					className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden transition-opacity duration-200"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
}
