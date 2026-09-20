"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#090b12] p-6 text-center text-white">
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">Admin console error</p>
				<h1 className="mt-3 text-2xl font-bold">This view could not load.</h1>
				<button type="button" onClick={() => reset()} className="mt-6 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500">Try again</button>
			</div>
		</main>
	);
}
