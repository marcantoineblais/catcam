"use client";

import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import Button from "@/components/ui/Button";

type OpenModalProps = {
  modalTitle: ReactNode;
  modalContent: ReactNode;
};

type ModalContextType = {
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<ReactNode>(null);
  const [isVisible, setIsVisible] = useState(false);

  const openModal = useCallback(
    ({ modalTitle, modalContent }: OpenModalProps) => {
      setContent(modalContent);
      setTitle(modalTitle);
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setTitle(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      startTransition(() => {
        setIsVisible(false);
      });
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(isOpen);
    }, 10);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen &&
        createPortal(
          <div
            className="z-50 fixed inset-0 flex justify-center items-start px-4 py-[10%] bg-black/50 duration-500 opacity-0 data-visible:opacity-100"
            data-visible={isVisible || undefined}
            role="alert"
            aria-live="assertive"
            aria-labelledby="warning"
            tabIndex={-1}
          >
            <div className="flex flex-col bg-surface-card dark:bg-neutral-700 rounded-lg overflow-hidden">
              <div className="py-2 px-4 text-lg font-bold">
                <h3>{title}</h3>
              </div>
              <div className="p-6 flex flex-col justify-center min-h-32">{content}</div>
              <div className="py-2 px-8 flex justify-end items-center border-t border-dark/10">
                <Button
                  onClick={closeModal}
                  color="primary"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
