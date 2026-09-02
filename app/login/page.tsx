"use client";

import { useState } from "react";

import Container from "@/components/Container";
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
      <Container className="flex flex-col justify-center">
        <form
          onSubmit={submitForm}
          className="w-full px-3 py-6 shadow bg-surface-card rounded-lg"
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
