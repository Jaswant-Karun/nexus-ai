"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-6xl font-extrabold text-gradient mb-4">Oops</h1>
        <p className="text-dark-400 mb-8">Something went wrong. Please try again.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
