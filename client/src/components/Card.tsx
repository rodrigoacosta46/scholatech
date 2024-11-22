import React from 'react';
//@ts-ignore
const Card = ({ className = '', scheme, children, ...props }) => {
  return (
    <div
      className={
        `bg-white p-4 flex flex-col shadow-[3px_3px] shadow-${scheme}-900 ` +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
