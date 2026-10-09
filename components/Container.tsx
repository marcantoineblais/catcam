import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Container({ children, className, ...props }: Props) {
  return (
    <main
      className={twMerge(
        "w-full h-full min-h-max max-h-full px-3 py-4 md:px-4 md:py-6 container mx-auto max-w-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
