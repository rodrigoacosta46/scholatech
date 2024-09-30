import { useState } from 'react';
import Title from '../../components/Title';
import Searchbar from '../../components/Searchbar';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { userHook } from '../../hooks/userHook';

const Drugs = () => {
  // Por default, traer drogas más comunes
  // Tiene que haber un apartado para drogas ya usadas por le paciente
  const { userInfo, userConfig } = userHook();
  const [modal, setModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);

  const modalSetState = () => {
    setModal(!modal);
  };

  const addDrug = (e) => {};
  const deleteDrug = (e) => {
    e.stopPropagation();
    confirm('Elimino medicamento');
  };

  function getItems() {
    let items = [];

    for (let i = 0; i < 19; i++) {
      items.push(
        <Card
          key={'n-' + i}
          onClick={modalSetState}
          style={{ animationDelay: i * 0.1 + 's' }}
          className="opacity-0 animate-fadeIn cursor-pointer relative "
          scheme={userConfig.theme}
        >
          {userInfo.role == 'Admin' && (
            <i
              onClick={deleteDrug}
              className="fa-solid fa-trash absolute end-1 hover:text-red-700 transition-all"
            ></i>
          )}
          <img src="img/logo.png" alt="" />
          <Title
            txt="Medicamentos"
            className="overflow-hidden"
            scheme={userConfig.theme}
          />
          <p className="text-slate-500 m-3 line-clamp-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
            voluptatibus inventore architecto earum nesciunt commodi, illo quae
            praesentium cumque iure minus laborum asperiores vel assumenda,
            veritatis voluptates. Aperiam, omnis ipsa.
          </p>
        </Card>
      );
    }

    return items;
  }

  return (
    <>
      {userInfo.role == 'Admin' && (
        <Modal
          state={adminModal}
          setter={() => {
            setAdminModal(!adminModal);
          }}
          scheme={userConfig.theme}
        >
          <form action="#" className="col-span-2 grid grid-cols-2">
            <div className="flex justify-center items-center p-14 border-4 border-dashed border-slate-400">
              <label
                htmlFor="newDrugFile"
                className="flex flex-col text-center text-2xl text-slate-400 cursor-pointer"
              >
                <i className="fa-solid fa-file-arrow-up"></i>
                <span className="text-sm">Subir archivo</span>
                <input
                  type="file"
                  name="file"
                  id="newDrugFile"
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex flex-col items-center gap-4 p-4">
              <label htmlFor="newDrugTitle">
                <input
                  type="text"
                  name="title"
                  id="newDrugTitle"
                  placeholder="Nombre del medicamento"
                  className="outline-none text-slate-700"
                />
              </label>

              <textarea
                name=""
                id=""
                rows={4}
                placeholder="Descripción del medicamento"
                maxLength={1000}
                className="text-center resize-none outline-none p-px border border-red-700 focus:ring-0 focus:ring-1 ring-offset-4 ring-red-700 rounded-lg transition-all"
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme}>
        <img src="img/logo.png" alt="" className="max-h-96 object-cover" />
        <div className="flex flex-col w-fit overflow-hidden">
          <Title txt="Medicamento" className="" scheme={userConfig.theme} />
          <p className="m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            blanditiis ut modi aliquid? Impedit obcaecati, voluptates mollitia
            molestias distinctio blanditiis nesciunt accusamus aliquam laborum
            atque ex. Velit illo maiores nostrum.
          </p>
        </div>
      </Modal>

      <Title
        txt="Información sobre medicamentos"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex w-full text-end items-center">
        <Searchbar
          placeholder={'Buscar medicamento'}
          className="p-3 w-96 m-4 ms-auto"
        />
        {userInfo.role == 'Admin' && (
          <button
            onClick={setAdminModal}
            className="flex bg-slate-700 text-white py-2 px-4 rounded-3xl"
          >
            + Añadir droga
          </button>
        )}
      </div>
      <div className="grid place-content-evenly grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
        {getItems()}
      </div>
    </>
  );
};

export default Drugs;
