"use client";

import { useState } from "react";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import Modal from "@/components/modal/Modal";
import { useModal } from "@/components/modal/useModal";
import Button from "@/components/ui/Button";
import CheckboxInput from "@/components/ui/CheckboxInput";
import TextInput from "@/components/ui/TextInput";
import { useSession } from "@/hooks/useSession";
import { ErrorMessage } from "@/types/types";

export default function Login() {
  const { signIn } = useSession();
  const { isOpen, onOpen, onClose } = useModal();
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { email, password, rememberMe } = formData;

  async function submitForm(e: React.SubmitEvent) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError({
        error: "Missing fields",
        message: "Please fill in all required fields.",
      });
      onOpen();
      return;
    }

    try {
      const { ok } = await signIn(formData);
      if (!ok) {
        setError({
          error: "Wrong credentials",
          message: "Invalid password or username.",
        });
        setFormData((prev) => ({ ...prev, password: "" }));
        onOpen();
      }
    } catch (error) {
      console.error("[Login] Error during login:", error);
      setError({
        error: "Unexpected error",
        message: "An unexpected error occured, please retry.",
      });
      onOpen();
    }
  }

  return (
    <>
      <Container className="flex flex-col justify-center items-center">
        <form
          onSubmit={submitForm}
          className="card w-full max-w-sm px-6 py-8 md:px-8 md:py-10 shadow-elevated"
          autoComplete="on"
        >
          <div className="flex flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Logo className="size-11" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-muted">
              Sign in to check on your cats.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
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

            <div className="pt-3">
              <Button type="submit" color="primary" className="w-full h-11">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </Container>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onUnmount={() => setError(null)}
        header={error?.error}
        footer={
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
        }
      >
        {error?.message}
      </Modal>
    </>
  );
}
