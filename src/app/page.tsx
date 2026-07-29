import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Email Broadcaster
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/login/super-admin"
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Super Admin Login
          </Link>
          <Link
            href="/login/client"
            className="rounded-md border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Client Login
          </Link>
          <Link
            href="/login/user"
            className="rounded-md border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            User Login
          </Link>
        </div>

        <div className="mt-6 border-t border-zinc-200 pt-4 text-center text-sm dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">New here?</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link
              href="/register/client"
              className="font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Register as Client
            </Link>
            <Link
              href="/register/freelancer"
              className="font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Register as Freelancer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
