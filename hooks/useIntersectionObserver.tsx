"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

type IntersectionObserverContextValue = {
  observe: (element: Element, callback: IntersectionCallback) => void;
  unobserve: (element: Element) => void;
};

const IntersectionObserverContext =
  createContext<IntersectionObserverContextValue | null>(null);

type Props = {
  children: ReactNode;
  root: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export default function IntersectionObserverProvider({
  children,
  root,
  rootMargin = "100%",
  threshold = 0,
}: Props) {
  const subscribersRef = useRef<Map<Element, IntersectionCallback>>(new Map());
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          subscribersRef.current.get(entry.target)?.(entry);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    setObserver(observer);  
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold]);

  const observe = useCallback(
    (element: Element, callback: IntersectionCallback) => {
      subscribersRef.current.set(element, callback);
      observer?.observe(element);
    },
    [observer],
  );

  const unobserve = useCallback(
    (element: Element) => {
      subscribersRef.current.delete(element);
      observer?.unobserve(element);
    },
    [observer],
  );

  return (
    <IntersectionObserverContext.Provider value={{ observe, unobserve }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
}

export function useIntersectionObserver() {
  const context = useContext(IntersectionObserverContext);

  if (!context) {
    throw new Error(
      "useIntersectionObserver must be used inside IntersectionObserverProvider",
    );
  }

  const { observe, unobserve } = context;
  const [element, setElement] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!element) return;

    observe(element, (entry) => {
      setIsVisible(entry.isIntersecting);
    });

    return () => {
      unobserve(element);
    };
  }, [element, observe, unobserve]);

  return { isVisible, setElement, element };
}
