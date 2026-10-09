"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="py-16 px-4 mx-auto w-full max-w-sm flex flex-col justify-center items-center gap-8 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-8xl font-bold tracking-tighter text-primary">
          500
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-sm text-muted">
          An unexpected error occured. Please try again in a moment.
        </p>
      </div>

      <Button onClick={() => router.push("/")} color="primary" className="w-44">
        Home page
      </Button>
    </div>
  );
}
