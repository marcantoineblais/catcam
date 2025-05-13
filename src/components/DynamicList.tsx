import { ReactNode, useEffect, useState } from "react";

export default function DynamicList({ maxItems = 50, children }: { maxItems?: number, children: ReactNode[] }) {
  const [visibleElements, setVisibleElements] = useState<ReactNode[]>([]);

  useEffect(() => {
    setVisibleElements(children.slice(0, maxItems));
  }, []);

  useEffect(() => {

  }, [children, maxItems])

  return (
    <div>
     {visibleElements}
    </div>
  )
}