import React, { useState } from 'react';
import Title from '../../components/Title';
import Section from '../../components/Section';
import OpenCard from '../../components/OpenCard';
import { userHook } from '../../hooks/userHook';

const Treatments = () => {
    const { userConfig } = userHook();
	const [formView, setFormView] = useState();
	

    return(
        <>
   
            <Title txt="Diagnosticos de paciente" allowAnimations={true} scheme={userConfig.theme}/>
            
            <div className="m-12 space-y-32">
            <div className="overflow-hidden">
           	<Section txt="Nuevo diagnostico" scheme={userConfig.theme} icon={<button onClick={() => setFormView(!formView)} className="group rounded-full text-white transition-all duration-500 underline underline-offset-4"><i className="fa-solid fa-plus  transition-all duration-500 group-hover:rotate-180"></i><span className="transition-all delay-200 text-[0px] group-hover:text-lg">Nuevo resultado</span></button>}/>
           	
           		
           		<form className={`${formView ? "translate-y-0 opacity-100 visible" : "-translate-y-full invisible opacity-0" }`}>
           			<OpenCard
				    className="m-4 text-center"
				    icon={<i class="fa-solid fa-clipboard text-slate-700"></i>}
				    title={
				      <div className="ps-2 text-slate-700">
					Turno
					<label className="underline underline-offset-4 ms-2" htmlFor="checkN">
						<input type="checkbox" id="checkN" hidden={true} className="peer"/>
						<span className="transition-all text-base peer-checked:text-[0px]">Paciente</span>
						<input type="text" className="transition-all text-[0px] peer-checked:text-base" placeholder="Nombre del paciente"/>
					</label>
				      </div>
				    }
				    content={
				      <div className="relative pt-4 p-8">
					<div className="flex flex-wrap justify-evenly gap-3">
					  <p className="font-bold">
					    Doctor asignado:
					    <span className="ms-2 font-normal">Dr Otaro</span>
					  </p>
					  <p className="font-bold">
					    Motivo:
					    <span className="ms-2 font-normal">Tensión abdominal</span>
					  </p>
					  <p className="font-bold">
					    Fecha asignada:
					    <span className="ms-2 font-normal">20/03/29 11:30:00</span>
					  </p>
					  <p className="font-bold">
					    Fecha de pedido de consulta:
					    <span className="ms-2 font-normal">07/02/24</span>
					  </p>
					</div>
					<hr className="my-4" />
					<p className="text-2xl text-center">- Resultados -</p>
					<div className="relative bg-gray-200 flex flex-wrap justify-evenly text-center gap-3 p-12 my-2">
					  <button className="absolute end-2 bottom-2 text-sm text-gray-500">
					    <i className="fa-solid fa-download pe-1"></i>
					    Descargar comprobante
					  </button>
					  <p className="font-bold">
					    Diagnostico:
					    <span className="ms-2 font-normal">
					      Torsión de músculo superior
					    </span>
					  </p>
					  <p className="font-bold">
					    Notas:
					    <span className="ms-2 font-normal">
					      Tomar cada medicación cada 12 días Lorem ipsum dolor sit,
					      amet consectetur adipisicing elit. Sequi, quibusdam
					      adipisci omnis sunt cum magni eaque, itaque aliquid ipsam
					      amet dolores recusandae suscipit dolorem quos laborum
					      voluptate eos neque inventore.
					    </span>
					  </p>
					  <div className="font-bold">
					    Medicación asignada:
					    <ul className="ms-2 font-normal underline list-disc">
					      <li>Medicación</li>
					      <li>Medicación</li>
					      <li>Medicación</li>
					      <li>Medicación</li>
					    </ul>
					  </div>
					</div>
				      </div>
				    }
				  />
           		</form>
     
           </div>
           <div>
            	<Section txt="Resultados" scheme={userConfig.theme}/>
            	<OpenCard
            className="m-4 text-center"
            icon={<i class="fa-solid fa-clipboard-check text-green-700"></i>}
            title={
              <div className="ps-2 text-slate-700">
                Turno Raul Toledo <span className="font-bold">24/02/2022</span>
              </div>
            }
            content={
              <div className="relative pt-4 p-8">
                <div className="flex flex-wrap justify-evenly gap-3">
                  <p className="font-bold">
                    Doctor asignado:
                    <span className="ms-2 font-normal">Dr Otaro</span>
                  </p>
                  <p className="font-bold">
                    Motivo:
                    <span className="ms-2 font-normal">Tensión abdominal</span>
                  </p>
                  <p className="font-bold">
                    Fecha asignada:
                    <span className="ms-2 font-normal">20/03/29 11:30:00</span>
                  </p>
                  <p className="font-bold">
                    Fecha de pedido de consulta:
                    <span className="ms-2 font-normal">07/02/24</span>
                  </p>
                </div>
                <hr className="my-4" />
                <p className="text-2xl text-center">- Resultados -</p>
                <div className="relative bg-gray-200 flex flex-wrap justify-evenly text-center gap-3 p-12 my-2">
                  <button className="absolute end-2 bottom-2 text-sm text-gray-500">
                    <i className="fa-solid fa-download pe-1"></i>
                    Descargar comprobante
                  </button>
                  <p className="font-bold">
                    Diagnostico:
                    <span className="ms-2 font-normal">
                      Torsión de músculo superior
                    </span>
                  </p>
                  <p className="font-bold">
                    Notas:
                    <span className="ms-2 font-normal">
                      Tomar cada medicación cada 12 días Lorem ipsum dolor sit,
                      amet consectetur adipisicing elit. Sequi, quibusdam
                      adipisci omnis sunt cum magni eaque, itaque aliquid ipsam
                      amet dolores recusandae suscipit dolorem quos laborum
                      voluptate eos neque inventore.
                    </span>
                  </p>
                  <div className="font-bold">
                    Medicación asignada:
                    <ul className="ms-2 font-normal underline list-disc">
                      <li>Medicación</li>
                      <li>Medicación</li>
                      <li>Medicación</li>
                      <li>Medicación</li>
                    </ul>
                  </div>
                </div>
              </div>
            }
          />
            </div>
            </div>
        </>
    )
}

export default Treatments;
