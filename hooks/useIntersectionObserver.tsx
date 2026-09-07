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
  root?: RefObject<Element | null> | Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

function getRootElement(
  root?: RefObject<Element | null> | Element | null,
): Element | null {
  if (!root) return null;
  if ("current" in root) return root.current;
  return root;
}

export default function IntersectionObserverProvider({
  children,
  root,
  rootMargin = "100%",
  threshold = 0,
}: Props) {
  const callbacksRef = useRef(new Map<Element, IntersectionCallback>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const optionsRef = useRef({ rootMargin, threshold });

  const getObserver = useCallback(() => {
    const rootElement = getRootElement(root);
    const optionsChanged =
      optionsRef.current.rootMargin !== rootMargin ||
      optionsRef.current.threshold !== threshold;

    if (observerRef.current) {
      if (!optionsChanged && observerRef.current.root === rootElement) {
        return observerRef.current;
      }
      observerRef.current.disconnect();
    }

    optionsRef.current = { rootMargin, threshold };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          callbacksRef.current.get(entry.target)?.(entry);
        }
      },
      {
        root: rootElement,
        rootMargin,
        threshold,
      },
    );

    observerRef.current = observer;

    callbacksRef.current.forEach((_, element) => {
      observer.observe(element);
    });

    return observer;
  }, [root, rootMargin, threshold]);

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

  // Update observer when root/options change and clean up when unmounting
  useEffect(() => {
    getObserver();

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [getObserver]);

  return (
    <IntersectionObserverContext.Provider value={{ observe, unobserve }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
}

export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
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
