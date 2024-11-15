import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useFetch = (url: string, request?: Record<string, any>) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const cancelTokenSource = useRef<any>(null);

  const fetcher = async () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("Request cancelada");
    }
    cancelTokenSource.current = axios.CancelToken.source();

    try {
      const result = await axios.post(url, request, {
        withCredentials: true,
        cancelToken: cancelTokenSource.current.token,
      });
      let parsed;
      try {
        parsed = JSON.parse(result.data.message);
      } catch {
        console.log("Respuesta no es un conjunto de datos");
        parsed = result.data;
      }
      setResponse(parsed);
      setError(null);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Petición cancelada");
      } else {
        console.log("Error:", error);
        setError(error);
      }
      const response = error?.response?.data;
      if (response) {
        if (response.hasOwnProperty("redirect_route")) {
          console.log("REDIRECT ROUTE");
          window.location.href = response.redirect_route;
        } else {
          console.log("NO REDIRECT ROUTE");
        }

        if (response.hasOwnProperty("message")) {
          console.log("Mensaje en la respuesta");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted");
      }
    };
  }, [url, request]);

  return { response, fetcher, loading, error };
};

export default useFetch;
