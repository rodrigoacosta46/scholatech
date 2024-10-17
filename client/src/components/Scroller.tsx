import React, { useEffect, useState } from "react";

/*
interface Props {
  loader: (e: any) => void;           
  className?: string;                 
  children: React.ReactNode;          
  props?: { [key: string]: any };     
}
*/

const Scroller:React.FC<any> = ({loader, className, children, ...props}) => {
  const container = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(container.current?.scrollLeft);

  const handleScroll = (tX) => {
    container.current?.scrollBy({ left: tX, behavior: "smooth" });
    setScrolled(container.current?.scrollLeft);
  };

  useEffect(() => {  
    let { scrollLeft, scrollWidth, clientWidth }:any = container.current;

    if ( scrollLeft + clientWidth >= scrollWidth - 280){
      loader();
    }
  }, [scrolled]);
  
  return (
    <div className={`grid relative overflow-hidden ${className}`} {...props}>
      <button
        onClick={() => handleScroll(-320)}
        className="absolute w-7 h-full rounded-tr-full rounded-br-full backdrop-blur-md z-10 "
      >
        <i className="fa-solid fa-chevron-left absolute text-4xl top-40 start-0"></i>
      </button>
      <button
        onClick={() => handleScroll(320)}
        className="absolute w-7 h-full rounded-tl-full rounded-bl-full backdrop-blur-md z-10 end-0"
      >
        <i className="fa-solid fa-chevron-right absolute text-4xl top-40 end-0"></i>
      </button>
      <div
        onScroll={(e:any) => setScrolled(e.target.scrollLeft)}
        ref={container}
        className="flex [justify-content:safe_center] h-fit gap-4 py-1 px-8 overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {children}
      </div>
    </div>
  );
};

export default Scroller;
