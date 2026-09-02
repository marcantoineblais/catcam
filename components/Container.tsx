import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Container({ children, className, ...props }: Props) {
  return (
    <main
      className={twMerge(
        "w-full h-full min-h-max max-h-full py-2 px-2 container mx-auto max-w-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
