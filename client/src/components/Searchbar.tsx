import React from 'react';

interface Props {
  placeholder: string;
  className?: string;
  props?: any;
}

const Searchbar = (params:Props) => {
    return (
      <div
        className={
          "flex items-center text-slate-400 bg-slate-200 rounded-3xl " +
          params.className
        }
      >
        <i className="fa-solid fa-magnifying-glass pe-2"></i>
        <input
          type="text"
          placeholder={params.placeholder}
          className={
            `w-full bg-transparent outline-none border-b-2 border-slate-300 focus:border-slate-400 focus:text-slate-600`
          }
          {...params.props}
        />
      </div>
    );
}

export default Searchbar;