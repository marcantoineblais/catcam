"use client";

import { ModalProvider } from "../hooks/useModal";

export default function ModalWrapper(props: React.ComponentProps<typeof ModalProvider>) {
  return <ModalProvider>{props.children}</ModalProvider>;
}