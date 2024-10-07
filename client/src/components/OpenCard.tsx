import React, { useState } from "react";

const OpenCard = ({ title, content, className="" }) => {
    const [open, setOpen] = useState(false); 
    const [discard, setDiscard] = useState(false);

    const handleDelete = () => {
        setDiscard(true);
    }

    return(
        <div className={`${(discard ? "animate-[fadeIn_.8s_ease-in-out_1_reverse_forwards] p-0 max-h-0" : "p-5") + " transition-all duration-1000 h-fit overflow-hidden relative flex flex-col bg-white rounded-2xl shadow-[4px_4px] shadow-gray-400 " + className}`}>
            <div className="flex items-center">
                <button
                    className="absolute end-5 text-gray-400 text-thin"
                    onClick={() => { setOpen(!open) }}
                >
                    <i className="fa-solid fa-chevron-down"></i>
                </button>
                { title }
            </div>
            <div className={open ? "block" : "hidden" + " relative" }>
                { content }
                <div onClick={handleDelete} className="cursor-pointer transition-all duration-200 absolute flex w-3 overflow-hidden hover:w-[72px] bottom-0 end-3 text-sm underline text-slate-500 hover:text-red-600">
                    <i className="fa-solid fa-trash"></i>
                    Eliminar
                </div>
            </div>
        </div>
    )
}

export default OpenCard;