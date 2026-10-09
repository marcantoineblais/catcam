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
  closeOnOutsideClick = false,
  onClose,
  onUnmount,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mountModal = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setIsMounted(true);
        return;
      }

      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
        onUnmount?.();
      }, 300);
    },
    [onUnmount],
  );

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
        className="group/modal z-50 fixed inset-0 flex justify-center items-start px-4 pt-[14vh] bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-300 data-visible:opacity-100"
        data-visible={isVisible || undefined}
        role="alert"
        aria-live="assertive"
        aria-labelledby="warning"
        tabIndex={-1}
        onClick={handleOutsideClick}
      >
        <div
          className="card w-full md:w-md flex flex-col overflow-hidden shadow-elevated translate-y-3 scale-[0.97] transition-transform duration-300 ease-out group-data-visible/modal:translate-y-0 group-data-visible/modal:scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-4 pb-1 pl-5 pr-3 flex justify-between items-center gap-4">
            <div className="text-lg font-semibold tracking-tight">{header}</div>
            <IconButton
              icon={faXmark}
              ariaLabel="Close"
              onClick={onClose}
              className="size-9 text-muted hover:text-text"
            />
          </div>
          <div className="px-5 pb-5 pt-1 flex flex-col justify-center min-h-20 text-sm leading-relaxed text-muted">
            {children}
          </div>
          <div className="px-5 py-3.5 flex justify-end gap-2 items-center bg-text/3 border-t border-border">
            {footer}
          </div>
        </div>
      </div>,
      document.body,
    )
  );
}
