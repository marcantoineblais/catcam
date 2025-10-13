"use client";

import { useState } from "react";
import Logo from "../../components/Logo";
import { useSession } from "@/src/hooks/useSession";
import { useModal } from "@/src/hooks/useModal";

export default function Login() {
  const { signIn } = useSession();
  const { openModal } = useModal();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { email, password, rememberMe } = formData;

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      openModal({
        modalTitle: "Missing fields",
        modalContent: <p>Please fill in both email and password fields.</p>,
      });
      return;
    }

    try {
      const { ok } = await signIn(formData);
      if (!ok) {
        openModal({
          modalTitle: "Wrong credentials",
          modalContent: <p>Invalid password or username.</p>,
        });
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      openModal({
        modalTitle: "Unexpected error",
        modalContent: <p>An unexpected error occured, please retry.</p>,
      });
      console.error("[Login] Error during login:", error);
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <main className="h-full px-1 pt-5 max-w-(--breakpoint-md) container mx-auto overflow-auto">
        <form
          onSubmit={submitForm}
          className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10"
          autoComplete="on"
        >
          <h1 className="w-full pb-10 text-center text-3xl paysage-hidden">
            Login
          </h1>

          <label className="flex pt-3">
            <p className="basis-32 text-sm">Email</p>
            <input
              className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950"
              name="email"
              value={email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </label>

          <label className="flex pt-3">
            <p className="basis-32 text-sm">Password</p>
            <input
              className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950"
              name="password"
              type="password"
              value={password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </label>

          <label className="flex pt-3">
            <p className="basis-32 text-sm">Remember me</p>
            <input
              className="bg-gray-100 rounded"
              id="remember-me dark:text-zinc-950"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: e.target.checked,
                }))
              }
            />
          </label>

          <div className="pt-5 flex justify-center">
            <button
              type="submit"
              className="py-2 w-32 bg-sky-800 text-gray-50 rounded duration-200 hover:bg-sky-700 cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </main>

      <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150 landscape:hidden lg:landscape:block" />
    </div>
  );
}
