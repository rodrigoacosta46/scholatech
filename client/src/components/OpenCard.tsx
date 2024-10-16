import React, { useState } from "react";

interface OpenCardProps {
    icon: React.ReactNode,
    title: React.ReactNode,
    content: React.ReactNode,
    className?: string,
    children?: React.ReactNode,
    props?: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>
  }

const OpenCard = (params: OpenCardProps) => {
  return (
    <details className={`group bg-white rounded-2xl shadow-[4px_4px] shadow-gray-400 p-6 outline-none ${params.className}`} {...params.props}>
      <summary className="flex items-center gap-4 list-none cursor-pointer transition-all group-open:mb-4">
        {params.icon}
        <span className="break-all line-clamp-1">
            {params.title}
        </span>
        <i className="fa-solid fa-chevron-down ms-auto block text-gray-400 transition-all group-open:text-slate-500 group-open:rotate-180"></i>
      </summary>
      <div className="mt-2 break-all line-clamp-[9]">
        {params.content}
      </div>
      {params.children}
    </details>
  );
};

export default OpenCard;
