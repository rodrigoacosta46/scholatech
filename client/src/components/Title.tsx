import React from 'react';

const Title = ({
  txt,
  allowAnimations = false,
  scheme = 'green',
  className = `text-2xl w-fit bg-slate-200 text-${scheme}-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-${scheme}-800`,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <p>{txt}</p>
      <div className="grid grid-flow-col grid-cols-6 w-full h-1">
        <div
          style={{ animationDelay: '.1s' }}
          className={
            (allowAnimations ? 'animate-slideIn opacity-0 ' : '') +
            `col-span-2 bg-${scheme}-800 h-full`
          }
        />
        <div
          style={{ animationDelay: '.4s' }}
          className={
            (allowAnimations ? 'animate-slideIn opacity-0 ' : '') +
            `col-span-3 bg-${scheme}-600 h-full`
          }
        />
        <div
          style={{ animationDelay: '.7s' }}
          className={
            (allowAnimations ? 'animate-slideIn opacity-0 ' : '') +
            `bg-${scheme}-400 h-full`
          }
        />
      </div>
    </div>
  );
};

export default Title;
