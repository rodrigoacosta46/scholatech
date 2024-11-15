import { useState, useEffect, useCallback, useRef } from "react";
import useFetch from "./useFetch";

const usePagination = (url: string, pageNum: number, setPageNum: any, params: Record<string, any> = {}) => {
  const [dataPagination, setDataPagination] = useState<any>([]);
  const [theresMore, setNo] = useState(true);
  const { response, fetcher, error, loading } = useFetch(url, {
    ...params,
    Page: pageNum,
  });
  
  const prevParams = useRef(params);

  useEffect(() => {
    if (JSON.stringify(prevParams.current) !== JSON.stringify(params)) {
      console.log('Params han cambiado, reseteando paginador');
      setPageNum(1);
      setDataPagination([]);
      setNo(true);
      fetcher();
      prevParams.current = params;
    }
  }, [params]);

  useEffect(() => {
    console.log(theresMore, loading, error);
    if (theresMore) {
      console.log("Cargando página: ", pageNum);
      fetcher();
    }
  }, [pageNum, theresMore]);

  useEffect(() => {
    if (response) {
      console.log("Respuesta recibida: ", response);
      if (response.object && response.object !== "null") {
        setDataPagination((prev) => [...prev, ...JSON.parse(response.object)]);
      } else {
        setNo(false);
      }
    }
  }, [response]);

  return { dataPagination, error, loading, theresMore };
};

export default usePagination;
