import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const usePagination = (url: string, params: Record<string, any> = {}) => {
  const [page, setPage] = useState(1);
  const [dataPagination, setDataPagination] = useState<any>([]);
  const [theresMore, setNo] = useState(true);
  const { response, fetcher, error, loading } = useFetch(url);
  
  const fetchNextPage = () => {
    fetcher( {
      ...params,
      Page: page,
    });
    setPage(prev => prev + 1);
  }

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

  useEffect(() => {
    fetchNextPage();
  },[]);

  return { dataPagination, error, loading, theresMore, fetchNextPage, currentPage: page};
};

export default usePagination;
