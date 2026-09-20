import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Nexus AI Admin",
	description: "Operations and governance console for Nexus AI.",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
