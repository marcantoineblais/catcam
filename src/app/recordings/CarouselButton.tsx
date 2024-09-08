import { MouseEventHandler } from "react";

export default function CarouselButton({ label, rightAlign, active, onClick }: { label: string, active?: boolean, rightAlign?: boolean, onClick?: MouseEventHandler }) {
    return (
        <button 
            onClick={onClick}
            data-right={rightAlign}
            data-active={active ? true : undefined} 
            className="px-3 basis-5/12 border-b-4 border-gray-400 text-gray-700 text-xl text-left duration-200 
                    dark:text-zinc-300 
                    hover:brightness-150 hover:dark:brightness-75 
                    data-[active]:border-sky-700 data-[active]:cursor-default data-[active]:hover:brightness-100
                    data-[right]:text-right"
        >
            {label}
        </button>
    )
}