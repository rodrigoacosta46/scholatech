import axios from 'axios';
import { useState } from 'react';

const useFetch = (url: string, request?: Record<string, any>) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetcher = async () => {
    try {
      const result = await axios.post(
        url,
        request,
        { withCredentials: true }
      );
      var response = result.data;
      var parsed = JSON.parse(response.message);
      console.log("AHHHHHHHHHHHHHHH");
      setResponse(parsed);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error);
      console.error("Error de consulta", error);
      console.log("Resultados JSON");
      console.log(error.response?.data);
      var response = error.response?.data;
  
      if (response.hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE");
        window.location.href = response.redirect_route;
      } else {
        console.log("NO REDIRECT ROUTE");
      }
      if (response.hasOwnProperty("message")) {
        console.log("THERE IS A MESSAGE");
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, fetcher, loading, error, };
};

export default useFetch;
