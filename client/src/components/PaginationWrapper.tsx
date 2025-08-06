import LoadSpinner from "./LoadSpinner";

const PaginationWrapper = ({
  error,
  loading,
  data,
  renderModel,
  emptyMessage,
  className = "",
}) => {
  if (error) {
    return (
      <div className={`text-center my-4 ${className}`}>
        Hubo un error de consulta, comprobar conexión
      </div>
    );
  }

  if (data && data.length > 0) {
    return (
      <>
        {data.map((item, index) => renderModel(item, index))}
        <div className={`flex flex-col items-center ${className}`}>
          {loading && (
            <>
              <LoadSpinner /> 
              Cargando...
            </>
          )}
        </div>
      </>
    );
  }

  return <div className={`text-center my-4 ${className}`}>{emptyMessage}</div>;
};

export default PaginationWrapper;
