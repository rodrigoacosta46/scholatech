import { useEffect, useRef, useState } from "react";
import usePagination from "../hooks/usePagination";
import React from "react";
import PaginationWrapper from "./PaginationWrapper";

const VerticalScroller: React.FC<any> = ({ url, params = {}, className = "", renderModel, empty, ...props }) => {
  const { dataPagination, setPageNum, error, loading, theresMore, srcChanging } = usePagination(url, params);
  const flag = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && theresMore && !srcChanging && !loading && error == null) {
        setPageNum((prev) => prev+1);
      }
    }, { threshold: 0.7 });

    if (flag.current) observer.observe(flag.current);
    return () => {
      if (observer) observer.disconnect();
    };
  }, [theresMore, srcChanging, loading, error]);

  return (
    <div className={`relative ${className}`} {...props}>
      <PaginationWrapper
        error={error}
        loading={loading}
        data={dataPagination}
        renderModel={renderModel}
        emptyMessage={empty}
      />
      {
        theresMore && error == null && <div ref={flag}/>
      }
    </div>
  );
};

export default VerticalScroller;