"use client";

import { useRouter } from "next/dist/client/components/navigation";

import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="py-16 px-4 mx-auto w-full max-w-sm flex flex-col justify-center items-center gap-8 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-8xl font-bold tracking-tighter text-primary">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          This page does not exist
        </h2>
        <p className="text-sm text-muted">
          The cats must have knocked it off the table.
        </p>
      </div>

      <Button className="w-44" color="primary" onClick={() => router.push("/")}>
        Home page
      </Button>
    </div>
  );
}
