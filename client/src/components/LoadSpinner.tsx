import React from "react";

const LoadSpinner:React.FC<any> = ({props, className=""}) => {
    return(
        <div {...props} className={`${className} bg-white size-14 rounded-full border-8 border-green-400 border-t-8 border-t-blue-950 animate-spin`}></div>
    )
}

export default LoadSpinner;