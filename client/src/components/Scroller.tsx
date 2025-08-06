import React, { useEffect, useRef, useState } from 'react';
import usePagination from '../hooks/usePagination';
import PaginationWrapper from './PaginationWrapper';

const Scroller: React.FC<any> = ({ url, params = {}, className = "", renderModel, empty, ...props }) => {
  const { dataPagination, error, loading, theresMore, fetchNextPage } = usePagination(url, params);
  const container = useRef<HTMLDivElement>(null);
  const disableButtons = dataPagination.length == 0 ? 'hidden' : '';

  const handleScroll = (tX) => {
    container.current?.scrollBy({ left: tX, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container.current!;
      if (scrollLeft + clientWidth >= scrollWidth - 280 && theresMore && !loading && error == null) {
        fetchNextPage();
      }
    };

    const currentContainer = container.current;
    currentContainer?.addEventListener('scroll', handleScrollEvent);

    return () => {
      currentContainer?.removeEventListener('scroll', handleScrollEvent);
    };
  }, [theresMore, loading, error]);

  return (
    <div className={`grid relative overflow-hidden ${className}`} {...props}>
      <button onClick={() => handleScroll(-320)} className={`${disableButtons} absolute w-7 h-full z-10`}>
        <i className="fa-solid fa-chevron-left absolute text-4xl top-40 start-0"></i>
      </button>
      <button onClick={() => handleScroll(320)} className={`${disableButtons} absolute w-7 h-full z-10 end-0`}>
        <i className="fa-solid fa-chevron-right absolute text-4xl top-40 end-0"></i>
      </button>
      <div ref={container} className="flex [justify-content:safe_center] py-1 px-8 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <PaginationWrapper
          error={error}
          loading={loading}
          data={dataPagination}
          renderModel={renderModel}
          emptyMessage={empty}
        />
      </div>
    </div>
  );
};

export default Scroller;
