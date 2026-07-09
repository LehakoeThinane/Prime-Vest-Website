import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Prime Vest</h1>
      <p className="max-w-md text-base opacity-70">
        Investment platform scaffold — Django API + Next.js frontend.
      </p>
      <Link
        href="/login"
        className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Sign in
      </Link>
    </main>
  );
}
