import Link from "next/link";

export function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					href="/"
					className="text-lg font-semibold tracking-tight text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded"
				>
					BD 2.0 Archives
				</Link>
				<nav className="flex items-center gap-6" aria-label="Main">
					<Link
						href="/"
						className="text-sm text-neutral-600 hover:text-neutral-900"
					>
						News
					</Link>
				</nav>
			</div>
		</header>
	);
}
