"use client";

import { useRouter } from "next/navigation";

import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="py-7 mx-auto w-full max-w-sm flex flex-col justify-center gap-7 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-8xl font-bold">500</h1>
        <h2 className="text-3xl">An unexpected error occured</h2>
      </div>

      <div className="">
        <Button
          onClick={() => router.push("/")}
          color="primary"
        >
          Home page
        </Button>
        <Logo />
      </div>
    </div>
  );
}
