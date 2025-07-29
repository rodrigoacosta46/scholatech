import { twMerge } from 'tailwind-merge';
//@ts-ignore
const Card = ({ className = '', scheme = 'green', children, ...props }) => {
  return (
    <div
      className={twMerge(
        `bg-white p-4 flex flex-col shadow-[3px_3px] shadow-${scheme}-800`,
        className)
      }
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
