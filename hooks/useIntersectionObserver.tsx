"use client";

import {
  createContext,
  ReactNode,
  RefObject,
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
  root: RefObject<Element | null>;
  rootMargin?: string;
  threshold?: number | number[];
};

export default function IntersectionObserverProvider({
  children,
  root,
  rootMargin = "100%",
  threshold = 0,
}: Props) {
  const callbacksRef = useRef(new Map<Element, IntersectionCallback>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rootElementRef = useRef<Element | null>(null);

  useEffect(() => {
    rootElementRef.current = root?.current ?? null;
  }, [root]);

  const getObserver = useCallback(() => {
    if (observerRef.current) {
      return observerRef.current;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          callbacksRef.current.get(entry.target)?.(entry);
        }
      },
      {
        root: rootElementRef.current,
        rootMargin,
        threshold,
      },
    );

    observerRef.current = observer;

    return observer;
  }, [rootMargin, threshold]);

  const observe = useCallback(
    (element: Element, callback: IntersectionCallback) => {
      callbacksRef.current.set(element, callback);
      getObserver().observe(element);
    },
    [getObserver],
  );

  const unobserve = useCallback((element: Element) => {
    callbacksRef.current.delete(element);
    observerRef.current?.unobserve(element);
  }, []);

  // Clean up the observer when the component unmounts
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <IntersectionObserverContext.Provider value={{ observe, unobserve }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
}

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
) {
  const context = useContext(IntersectionObserverContext);

  if (!context) {
    throw new Error(
      "useIntersectionObserver must be used inside IntersectionObserverProvider",
    );
  }

  const { observe, unobserve } = context;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observe(element, (entry) => {
      setIsVisible(entry.isIntersecting);
    });

    return () => {
      unobserve(element);
    };
  }, [ref, observe, unobserve]);

  return isVisible;
}
