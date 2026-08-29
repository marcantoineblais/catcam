"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import CheckboxInput from "@/components/ui/CheckboxInput";
import TextInput from "@/components/ui/TextInput";
import { useModal } from "@/hooks/useModal";
import { useSession } from "@/hooks/useSession";

import Logo from "../../components/Logo";

export default function Login() {
  const { signIn } = useSession();
  const { openModal } = useModal();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { email, password, rememberMe } = formData;

  async function submitForm(e: React.SubmitEvent) {
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
    <div className="h-full flex flex-col justify-center overflow-hidden">
      <main className="z-10 px-2 max-w-md container mx-auto overflow-auto">
        <form
          onSubmit={submitForm}
          className="w-full px-3 py-6 shadow bg-surface-card rounded"
          autoComplete="on"
        >
          <h1 className="w-full text-center text-3xl font-bold">Login</h1>

          <div className="mt-10 flex flex-col gap-4">
            <TextInput
              label="Email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
            />

            <TextInput
              label="Password"
              name="password"
              autoComplete="password"
              value={password}
              type="password"
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
            />

            <CheckboxInput
              label="Remember me"
              name="rememberMe"
              checked={rememberMe}
              onChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: checked,
                }))
              }
            />

            <div className="pt-5 flex justify-center">
              <Button type="submit" color="primary" className="w-44">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Logo className="fixed -bottom-1 text-dark dark:text-zinc-200 translate-y-1/2 scale-125 landscape:hidden lg:landscape:block" />
    </div>
  );
}
