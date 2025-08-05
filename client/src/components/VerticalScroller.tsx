import { useCallback, useEffect, useRef, useState } from "react";
import usePagination from "../hooks/usePagination";
import React from "react";
import PaginationWrapper from "./PaginationWrapper";

const VerticalScroller: React.FC<any> = ({ url, params = null, className = "", renderModel, empty, ...props }) => {
  const { dataPagination, error, loading, theresMore, fetchNextPage } = usePagination(url, params);
  const elObserve = useRef(null);

  const obsChangePage = entries => {
    if (entries[0].isIntersecting && theresMore && !loading && error == null) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(obsChangePage, { threshold: 0.7 });

    if (elObserve.current) observer.observe(elObserve.current);
    return () => {
      if (observer) observer.disconnect();
    };
  }, [theresMore, loading, error]);

  return (
    <div className={`relative ${className}`} {...props}>
      <PaginationWrapper
        error={error}
        loading={loading}
        data={dataPagination}
        renderModel={renderModel}
        emptyMessage={empty}
        className={"col-span-full"}
      /> 
      {
        theresMore && !error && <div ref={elObserve} className="h-1"/>
      }
    </div>
  );
};

export default VerticalScroller;