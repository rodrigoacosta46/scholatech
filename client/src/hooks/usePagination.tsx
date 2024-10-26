import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const usePagination = (url: string) => {
  const [dataPagination, setDataPagination] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const { response, fetcher, error, loading } = useFetch(url, {
    Page: pageNum,
  });

  const swipPage = () => {
    setPageNum((prev) => prev + 1);
  };

  useEffect(() => {
    fetcher();
  }, [pageNum]);

  useEffect(() => {
    if (response && response.object !== "null") {
      setDataPagination((prev) => [...prev, ...JSON.parse(response.object)]);
      setTotal(response.total);
    }
  }, [response]);

  return { dataPagination, total, pageNum, swipPage, error, loading };
};

export default usePagination;
