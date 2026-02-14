import Link from "next/link";

export function LoginHeader() {
	return (
		<header className="flex flex-col items-center gap-2 pb-8">
			<Link
				href="/"
				className="focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded-lg"
			>
				<span className="text-2xl font-semibold tracking-tight text-neutral-800">
					BD 2.0 Archives
				</span>
			</Link>
			<p className="text-sm text-neutral-500">Admin sign in</p>
		</header>
	);
}
