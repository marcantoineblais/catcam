"use client";

import { useRouter } from "next/dist/client/components/navigation";

import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="py-7 mx-auto w-full max-w-sm flex flex-col justify-center gap-7 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-8xl font-bold">404</h1>
        <h2 className="text-3xl">This page does not exist</h2>
      </div>

      <div>
        <Button
          className="w-44"
          color="primary"
          onClick={() => router.push("/")}
        >
          Return to home
        </Button>
      </div>
    </div>
  );
}
