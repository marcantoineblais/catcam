import { createRoot } from "react-dom/client";
import Popup from "../components/Popup";

export default function renderPopup(text: string | string[], title: string = "Error") {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const closePopup = () => {
        root.unmount()
        document.body.removeChild(container)
    }
    
    root.render(<Popup title={title} text={text} close={closePopup} />)
}