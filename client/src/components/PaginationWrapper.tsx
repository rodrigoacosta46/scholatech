import React from 'react';
import LoadSpinner from './LoadSpinner';

const PaginationWrapper = ({ error, loading, data, renderModel, emptyMessage }) => {
  
  if (error) {
    return <div className='text-center my-4'>Hubo un error de consulta, comprobar conexión</div>;
  }

  if (loading) {
    return (
      <div>
        <LoadSpinner className="mx-auto" />
        Cargando
      </div>
    );
  }

  if (data && data.length > 0) {
    return data.map((item, index) => renderModel(item, index));
  }

  return <div className='text-center my-4'>{emptyMessage}</div>;
};

export default PaginationWrapper;
