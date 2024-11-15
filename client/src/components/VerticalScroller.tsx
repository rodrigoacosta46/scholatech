import { useEffect, useRef, useState } from "react";
import usePagination from "../hooks/usePagination";
import React from "react";
import PaginationWrapper from "./PaginationWrapper";

const VerticalScroller: React.FC<any> = ({ url, params = {}, className = "", renderModel, empty, ...props }) => {
  const [page, setPage] = useState(1);
  const { dataPagination, error, loading, theresMore } = usePagination(url, page, setPage,params);
  const flag = useRef(null);
  

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && theresMore && !loading && error == null) {
        setPage((prev) => prev+1);
      }
    }, { threshold: 0.7 });

    if (flag.current) observer.observe(flag.current);
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
      />
      {
        theresMore && error == null && <div ref={flag}/>
      }
    </div>
  );
};

export default VerticalScroller;