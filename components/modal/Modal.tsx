import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import IconButton from "../ui/IconButton";

type Props = {
  isOpen: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
  onClose: () => void;
  onUnmount?: () => void;
};

export type ModalContent = {
  header?: ReactNode;
  footer?: ReactNode;
  body: ReactNode;
};

export default function Modal({
  isOpen,
  header,
  footer,
  children,
  closeOnOutsideClick = true,
  onClose,
  onUnmount,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mountModal = useCallback((isOpen: boolean) => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
      onUnmount?.();
    }, 500);
  }, [onUnmount]);

  useEffect(() => {
    startTransition(() => mountModal(isOpen));
  }, [isOpen, mountModal]);

  useEffect(() => {
  if (!isMounted) return;

  const frame = requestAnimationFrame(() => {
    setIsVisible(true);
  });

  return () => cancelAnimationFrame(frame);
}, [isMounted]);

  function handleOutsideClick() {
    if (closeOnOutsideClick) {
      onClose();
    }
  }

  return (
    isMounted &&
    createPortal(
      <div
        className="z-50 fixed inset-0 flex justify-center items-start px-4 py-[10%] bg-black/50 duration-500 opacity-0 data-visible:opacity-100"
        data-visible={isVisible || undefined}
        role="alert"
        aria-live="assertive"
        aria-labelledby="warning"
        tabIndex={-1}
        onClick={handleOutsideClick}
      >
        <div className="w-full md:w-md flex flex-col bg-surface-card dark:bg-neutral-700 rounded-lg overflow-hidden">
          <div className="py-2 px-4 text-lg font-bold flex justify-between items-center gap-4">
            <div>{header}</div>
            <div className="self-end">
              <IconButton
                icon={faXmark}
                ariaLabel="Close"
                onClick={onClose}
              />
            </div>
          </div>
          <div className="p-4 flex flex-col justify-center min-h-32">
            {children}
          </div>
          <div className="py-2 px-4 flex justify-end gap-2 items-center border-t border-text/10">
            {footer}
          </div>
        </div>
      </div>,
      document.body,
    )
  );
}
