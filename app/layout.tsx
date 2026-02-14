import type { Metadata } from "next";
import "./globals.css";
import "react-day-picker/style.css";

export const metadata: Metadata = {
	title: "Simply News",
	description: "News listing application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}
