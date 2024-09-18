"use client"

export default function QualityButton({ isHQ, setIsHQ }: { isHQ: boolean, setIsHQ: Function }) {
    return (
        <div className="relative w-full flex justify-end pe-3">
            <div onClick={() => setIsHQ(!isHQ)} className="py-1.5 w-16 flex gap-1 overflow-x-hidden cursor-pointer rounded-full">
                <div data-sq={!isHQ ? true : undefined} className="min-w-[8rem] h-full flex items-center text-sm font-bold text-white duration-1000 data-[sq]:-translate-x-16">
                    <div className="py-0.5 ps-2 basis-1/2 h-full text-left bg-sky-700 rounded-l-full">HQ</div>
                    <div className="py-0.5 pe-2 basis-1/2 h-full text-right bg-gray-500 rounded-r-full dark:bg-zinc-500">SQ</div>
                </div>
            </div>

            <div 
                className="absolute top-0.5 -right-1 data-[sq]:-translate-x-16 w-8 h-8 rounded-full bg-white cursor-pointer shadow-inner shadow-black/10 duration-1000 dark:bg-zinc-700 dark:shadow-white/10"
                data-sq={!isHQ ? true : undefined}
                onClick={() => setIsHQ(!isHQ)}
            ></div>
        </div>
    )
}