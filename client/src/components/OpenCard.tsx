import React from "react";

const OpenCard: React.FC<any> = ({icon, title, content, className = "", children, ...props}) => {
  return (
    <details className={`group bg-white rounded-2xl shadow-[4px_4px] shadow-gray-400 p-6 outline-none ${className}`} {...props}>
      <summary className="flex items-center gap-4 list-none cursor-pointer transition-all group-open:mb-4">
        {icon}
        <span className="break-all line-clamp-1">
            {title}
        </span>
        <i className="fa-solid fa-chevron-down ms-auto block text-gray-400 transition-all group-open:text-slate-500 group-open:rotate-180"></i>
      </summary>
      <div className="mt-2 break-all line-clamp-[9]">
        {content}
      </div>
      {children}
    </details>
  );
};

export default OpenCard;
