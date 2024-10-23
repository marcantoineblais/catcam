import React from "react";

export default function debounce(func: Function, ref: React.MutableRefObject<boolean>, wait: number) {
    if (!ref.current)
        return () => false;

    ref.current = false;
    func();

    const timeout = setTimeout(() => {
        ref.current = true;
        clearTimeout(timeout);
    }, wait);
}