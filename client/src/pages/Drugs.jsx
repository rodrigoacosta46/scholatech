import { useState } from "react";
import Title from "../components/Title";
import Searchbar from "../components/Searchbar";
import Card from "../components/Card";
import Modal from "../components/Modal";

const Drugs = () => {

  // Por default, traer drogas más comunes
  // Tiene que haber un apartado para drogas ya usadas por le paciente

  const [modal, setModal] = useState(false);

  const modalSetState = () => {
    setModal(!modal);
  };

  function getItems() {
    let items = [];

    for (let i = 0; i < 19; i++) {
      items.push(
        <Card
          key={"n-" + i}
          onClick={modalSetState}
          style={{ animationDelay: i * 0.1 + "s" }}
          className="opacity-0 animate-fadeIn cursor-pointer"
        >
          <img src="img/logo.png" alt="" />
          <Title txt="Medicamentos" className="overflow-hidden" />
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
      <Modal state={modal} setter={modalSetState}>
        <img src="img/logo.png" alt="" className="max-h-96 object-cover" />
        <div className="flex flex-col w-fit overflow-hidden">
          <Title txt="Medicamento" className="" />
          <p className="m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            blanditiis ut modi aliquid? Impedit obcaecati, voluptates mollitia
            molestias distinctio blanditiis nesciunt accusamus aliquam laborum
            atque ex. Velit illo maiores nostrum.
          </p>
        </div>
      </Modal>

      <Title txt="Información sobre medicamentos" allowAnimations={true} />

      <div className="w-full text-end">
        <Searchbar
          placeholder={"Buscar medicamento"}
          className="p-3 w-96 m-4 ms-auto"
        />
      </div>
      <div className="grid place-content-evenly grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
        {getItems()}
      </div>
    </>
  );
};

export default Drugs;
