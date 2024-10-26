import { useEffect, useRef, useState } from "react";
import usePagination from "../hooks/usePagination";
import React from "react";
import PaginationWrapper from "./PaginationWrapper";
import LoadSpinner from "./LoadSpinner";

const VerticalScroller = ({ url, className="", renderModel, empty, ...props }) => {
  const { dataPagination, swipPage, pageNum, total, error } = usePagination(url);
  const flag = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(swipPage, { threshold: 0.7 });
    if (flag.current != null) observer.observe(flag.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(()=>{
    console.log(dataPagination);
  },[dataPagination]);

  if (error) return <div>Hubo un error de consulta</div>;

  return (
    <div id="elpepe" className={className} {...props}>
      <PaginationWrapper
        error={error}
        loading={false}
        data={dataPagination}
        renderModel={renderModel}
        emptyMessage={empty}
      />
      {!dataPagination.object && Math.ceil(total/10) != pageNum &&(
        <div ref={flag}>
          <LoadSpinner className="absolute -bottom-14 mx-auto my-2 start-0 end-0" />
        </div>
      )}
    </div>
  );
};

export default VerticalScroller;
