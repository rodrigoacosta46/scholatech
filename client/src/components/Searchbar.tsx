import React from 'react';

const Searchbar = ({ placeholder, className, ...props }) => {
    return (
      <div
        className={
          "flex items-center text-slate-400 bg-slate-200 rounded-3xl " +
          className
        }
      >
        <i className="fa-solid fa-magnifying-glass pe-2"></i>
        <input
          type="text"
          placeholder={placeholder}
          className={
            "w-full bg-transparent outline-none border-b-2 border-slate-300 focus:border-slate-400 focus:text-slate-600 "
          }
          {...props}
        />
      </div>
    );
}

export default Searchbar;