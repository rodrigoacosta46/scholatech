import { useState } from "react";

const OpenCard = ({ className, title, content }) => {
    const [open, setOpen] = useState(false); 

    return(
        <div className={"relative flex flex-col bg-white p-5 rounded-2xl shadow-[4px_4px] shadow-gray-400 "+ className}>
            <div className="flex items-center">
                <button
                    className="absolute end-5 text-gray-400 text-thin"
                    onClick={() => { setOpen(!open) }}
                >
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
                { title }
            </div>
            <div className={open ? "block" : "hidden" }>
                { content }
            </div>
        </div>
    )
}

export default OpenCard;