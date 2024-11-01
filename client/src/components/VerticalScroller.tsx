import { useEffect, useRef, useState } from "react";
import usePagination from "../hooks/usePagination";
import React from "react";
import PaginationWrapper from "./PaginationWrapper";
import LoadSpinner from "./LoadSpinner";

const VerticalScroller: React.FC<any> = ({ url, params, className = "", renderModel, empty, ...props }) => {
  const { dataPagination, pageNum, setPageNum, error, loading, theresMore, srcChanging } = usePagination(url, params);
  const flag = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && theresMore && !srcChanging && !loading && error == null) {
        console.log("seteo otra vez")
        setPageNum((prev) => prev+1);
      }
    }, { threshold: 0.1 });

    if (flag.current) observer.observe(flag.current);
    return () => {
      if (observer) observer.disconnect();
    };
  }, [pageNum, theresMore, srcChanging, loading, error, params]);

  return (
    <div className={`relative ${className}`} {...props}>
      <PaginationWrapper
        error={error}
        loading={loading}
        data={dataPagination}
        renderModel={renderModel}
        emptyMessage={empty}
      />
      <div ref={flag} className="size-0"/>
    </div>
  );
};

export default VerticalScroller;