import axios from "axios";
import { useCallback, useState } from "react";

const useFetch = (url: string) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetcher = useCallback(async (request: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await axios.post(url, request, { withCredentials: true });
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
      console.log("Error:", error);
      setError(error);
      const response = error?.response?.data;
      if (response?.redirect_route) {
        window.location.href = response.redirect_route;
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { response, fetcher, loading, error };
};


export default useFetch;
