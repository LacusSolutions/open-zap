import Link from "next/link";
import type { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-7xl font-bold text-brand-500">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Go home
      </Link>
    </div>
  );
}
