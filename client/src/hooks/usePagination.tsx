import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const usePagination = (url: string, params: Record<string, any> = {}) => {
  const [dataPagination, setDataPagination] = useState<any>([]);
  const [pageNum, setPageNum] = useState(1);
  const [theresMore, setNo] = useState(true);
  const [srcChanging, setSrcState] = useState(false);
  const { response, fetcher, error, loading } = useFetch(url, {
    ...params,
    Page: pageNum,
  });

  useEffect(() => {
      if (Object.keys(params).length > 0) {
        console.log("Cambiando fuente, reseteando paginación", response);

      setSrcState(true);
      setPageNum(1); 
      setDataPagination([]); 
      setNo(true); 
      setSrcState(false); 
      }
  }, [params]);

  useEffect(() => {
    if (theresMore && !srcChanging) {
      console.log("Cargando página: ", pageNum);
      fetcher();
    }
  }, [pageNum, theresMore, srcChanging]); 

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

  return { dataPagination, pageNum, setPageNum, error, loading, theresMore, srcChanging };
};
export default usePagination;
