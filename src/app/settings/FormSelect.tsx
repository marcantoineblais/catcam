import { ChangeEventHandler } from "react";

export default function FormSelect(
    { label, options, value, onChange, name }:
    { label?: string, options?: {value: string, label: string }[], value?: string, onChange?: ChangeEventHandler<HTMLSelectElement>, name?: string }
) {
    return (
        <div className="flex pt-3 text-sm">
            <label className="basis-36">{label}</label>
            <select value={value} onChange={onChange} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name={name}>
                {options && options.map((option, i) => <option key={i} value={option.value}>{option.label}</option>)}
            </select>
        </div>
        
    )
}