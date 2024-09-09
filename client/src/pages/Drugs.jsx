import { useState } from 'react';
import Title from '../components/Title';
import Searchbar from '../components/Searchbar';

const Drugs = () => {
  const [modal, setModal] = useState(false);
  
  const modalSetState = () => {
    setModal(!modal);
  }

  function getItems() {
    let items = [];
    
    for(let i=0; i<19; i++) {

      items.push(
        <div
          key={ "n-"+i }
          onClick={ modalSetState }
          style={{ animationDelay: (i * 0.1)+'s'}}
          className={"opacity-0 animate-fadeIn bg-white p-4 flex flex-col shadow-[3px_3px] shadow-green-900 cursor-pointer"}
        >
          <img src="img/logo.png" alt="" />
          <Title txt="Medicamentos" />
          <p className="text-slate-500 m-3 line-clamp-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere voluptatibus inventore architecto earum nesciunt commodi, illo quae praesentium cumque iure minus laborum asperiores vel assumenda, veritatis voluptates. Aperiam, omnis ipsa.
          </p>
        </div>
      );
    }

    return items;
  }
  
  return (
    <>
      { 
        modal && 
        <div className="z-30 sticky top-0 grid place-content-center w-full min-h-full bg-black/30">
          <div className="animate-fadeIn relative grid gap-3 grid-cols-1 lg:grid-cols-4 bg-white shadow-[5px_5px] shadow-green-900 max-w-xl p-4">
            <div 
              onClick={ modalSetState }
              className="absolute cursor-pointer w-fit -top-3 end-0 px-3 py-1 bg-green-900 rounded-3xl text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="col-span-2">
              <img src="img/logo.png" alt="" className="h-full object-cover"/>
            </div>
            <div className='col-span-2 flex flex-col w-fit'>
              <Title txt="Medicamento"/>
              <p className="m-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis blanditiis ut modi aliquid? Impedit obcaecati, voluptates mollitia molestias distinctio blanditiis nesciunt accusamus aliquam laborum atque ex. Velit illo maiores nostrum.</p>
            </div>
          </div>
        </div> 
      }
      <div className="text-2xl w-fit bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700">
        <Title txt="Información sobre medicamentos"/>
      </div>
      <div className="w-full text-end">
        <Searchbar
          placeholder={"Buscar medicamento"}
          className="w-72 m-4 ms-auto"
        />
      </div>
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 grid-flow-row gap-4 p-7">
        { getItems() }
      </div>
    </>
  );
};

export default Drugs;
