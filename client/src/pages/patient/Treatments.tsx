import { useState, useRef, useEffect, useMemo } from "react";
import Title from "../../components/Title";
import Section from "../../components/Section";
import OpenCard from "../../components/OpenCard";
import { userHook } from "../../hooks/userHook";
import VerticalScroller from "../../components/VerticalScroller";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import InputScent from "../../components/InputScent";

const Treatments = () => {
  const { userInfo, userConfig } = userHook();
  const [medications, setMedications] = useState([]);
  const state = useRef(useLocation().state);
  const { ID, Paciente, Motivo, Fecha, CreatedAt } = state.current || {};
  const [formView, setFormView] = useState(state.current != null);
  const [formData, setFormData] = useState({});
  const { response, fetcher, error } = useFetch(
    process.env.REACT_APP_API_URL + "/assignmentResults");
  const navigate = useNavigate();

  const handleDrugChange = (e, index, field) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = String(e.target.value);
    setMedications(updatedMedications);
  };

  const submitNewTreatment = (e) => {
    e.preventDefault();

    if (state == null) {
      return alert("Asigne un turno pendiente para realizar diagnóstico");
    }

    const fields = e.target.elements;
    const armatoste = {
      ID: ID,
      Diagnostico: fields["Diagnostico"].value,
      Notas: fields["Notas"].value,
      Drogas: [...medications],
      PacienteID: Paciente.ID,
    };

    if (armatoste.Drogas.some((e) => {
      e.drug == null ||
      e.amount == null ||
      e.time == null
    })) {
      alert("Debe especificar el medicamento, cantidad y tiempo");
    }

    setFormData(armatoste);
  };

  useEffect(() => {
    if (formData && formData.hasOwnProperty("ID")) {
      fetcher({...formData});
    }
  }, [formData]);

  useEffect(() => {
    if (error != null && error.response?.data != null)
      return alert(error.response.data.message);

    if (response != null) {
      console.log(response);
      navigate("/treatments", { state: null, replace: true });
      window.location.reload();
    }
  }, [response, error]);

  const optionsModel = (registro, i, rowIndex) => {
    return (
      <li key={"op-" + i}>
        <input
          type="radio"
          name={`drug-${rowIndex}`}
          value={registro.ID}
          onChange={(e) => handleDrugChange(e, rowIndex, "drug")}
        />
        {registro.Nombre}
      </li>
    ); 
  };

  const inRows = () => {
    if (medications.length > 9)
      return alert("Solo hasta 10 medicamentos por diagnostico");
    setMedications([...medications, { drug: "0", amount: "0", time: "" }]);
  };

  const exRows = () => {
    let last = medications.length - 1;
    setMedications((prev) => prev.slice(0, last));
  };

  const treatModel = useMemo(() => (registro, i) => {
    console.log(registro);
    return (
      <OpenCard
        key={"j-" + i}
        style={{ animationDelay: (i % 10) * 0.05 + "s" }}
        className="animate-slideIn my-4 text-center opacity-0"
        icon={<i className="fa-solid fa-clipboard-check text-green-700"></i>}
        title={
          <div className="ps-2 text-slate-700">
            {registro.Turno.Paciente.Username}{" "}
            <span className="font-bold">
              {new Date(registro.CreatedAt).toLocaleString()}
            </span>
          </div>
        }
        content={
          <div className="relative pt-4">
            <div className="flex flex-wrap justify-evenly gap-3">
              <p className="font-bold">
                Doctor asignado:
                <span className="ms-2 font-normal">
                  {registro.Turno.Doctor.Username}
                </span>
              </p>
              <p className="font-bold">
                Motivo:
                <span className="ms-2 font-normal">
                  {registro.Turno.Motivo}
                </span>
              </p>
              <p className="font-bold">
                Fecha asignada:
                <span className="ms-2 font-normal">
                  {new Date(registro.Turno.Fecha).toLocaleString()}
                </span>
              </p>
              <p className="font-bold">
                Fecha de pedido de consulta:
                <span className="ms-2 font-normal">
                  {new Date(registro.Turno.CreatedAt).toLocaleString()}
                </span>
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
                <span className="ms-2 font-normal">{registro.Diagnostico}</span>
              </p>
              <p className="font-bold">
                Notas:
                <span className="ms-2 font-normal">{registro.Notas}</span>
              </p>
              {registro.Recetas != null && (
                <div className="font-bold">
                  Medicación asignada:
                  <ul className="ms-2 font-normal list-disc">
                    {registro.Recetas.map((drug, k) => (
                      <li
                        key={"drug-" + k}
                        title="Para más información, puede buscar la medicación en información sobre medicamentos"
                      >
                        {drug.Medicamento.Nombre}.....{drug.Cantidad}gr.....
                        {drug.Tomas}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        }
      />
    );
  },[]);
  
  return (
    <>
      <Title
        txt="Diagnosticos de paciente"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="relative m-4 mt-12 space-y-32">
        <div className="max-h-fit">
          <Section
            txt="Nuevo diagnostico"
            scheme={userConfig.theme}
            icon={
              <label
                htmlFor="checkView"
                className="cursor-pointer rounded-full text-white transition-all duration-500 underline underline-offset-4 space-x-1"
              >
                <input
                  type="checkbox"
                  id="checkView"
                  hidden={true}
                  checked={formView}
                  onChange={() => state.current != null ? setFormView(prev => !prev) : alert("Para realizar un nuevo diagnóstico, debe seleccionar un turno en el Historial de Consultas")}
                  className="peer"
                />
                <i className="fa-solid fa-minus transition-all duration-500 opacity-0 text-[0px] peer-checked:rotate-180 peer-checked:opacity-100 peer-checked:text-base"></i>
                <i className="fa-solid fa-plus transition-all duration-500 peer-checked:rotate-180 peer-checked:opacity-0 peer-checked:text-[0px]"></i>
              </label>
            }
          />
          <form
            onSubmit={submitNewTreatment}
            className={`transition-all duration-500 ${
              formView
                ? "translate-y-0 opacity-100 h-full"
                : "-translate-y-full opacity-0 h-0"
            }`}
          >
            <OpenCard
              className="max-w-full mt-2 md:m-4 text-center"
              open={state.current != null}
              icon={<i className="fa-solid fa-clipboard text-slate-700"></i>}
              title={
                <InputScent
                  title="Turno"
                  value={Paciente?.Username}
                  readOnly={true}
                  type="text"
                  placeholder="Nombre del paciente"
                  className="[field-sizing:content]"
                  required={true}
                />
              }
              content={
                <div className="relative pt-4 md:p-8">
                  <div className="flex flex-wrap justify-evenly gap-4">
                    <p className="font-bold">
                      Doctor asignado:
                      <span className="ms-2 font-normal">
                        {userInfo.Username + " (Tú)"}
                      </span>
                    </p>
                    <InputScent
                      value={Motivo}
                      readOnly={true}
                      type="text"
                      placeholder="Motivo de consulta"
                      required={true}
                    />
                   <InputScent
                      value={Fecha && new Date(Fecha).toLocaleString()}
                      readOnly={true}
                      type="text"
                      placeholder="Fecha de consulta"
                      required={true}
                    />
                    <InputScent
                      value={
                        CreatedAt && new Date(CreatedAt).toLocaleString()
                      }                      
                      readOnly={true}
                      type="text"
                      placeholder="Fecha de solicitud"
                      required={true}
                    />
                  </div>
                  <hr className="my-8" />
                  <p className="text-2xl text-center">- Resultados -</p>
                  <div className="relative overflow-visible bg-gray-200 flex flex-wrap justify-evenly text-center gap-3 p-4 py-8 md:p-12 space-y-2">
                      <InputScent
                        name="Diagnostico"
                        type="text"
                        placeholder="Diagnostico final"
                        className="w-full placeholder:text-center"
                        required={true}
                      />
                    <textarea
                      name="Notas"
                      placeholder="Notas adicionales"
                      rows={5}
                      className="w-full outline-none p-2"
                    ></textarea>
                    <div className="font-bold w-full">
                      Medicación asignada: *opcional*
                      <div className="relative space-y-2 border-2 border-dashed border-slate-400 p-3 mt-3">
                        <div className="flex flex-col absolute top-0 -end-4">
                          <button
                            type="button"
                            onClick={inRows}
                            className="bg-blue-950 text-white px-1 rounded-full"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                          <button
                            type="button"
                            onClick={exRows}
                            className="bg-red-950 text-white px-1 rounded-full"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 divide-y divide-gray-400">
                          {medications.length == 0 ? <p className="text-slate-500">Haga clic en el "+" para asignar receta</p> : medications.map((_, index) => (
                            <div
                              className="flex flex-wrap justify-center items-center gap-2 py-2"
                              key={"ke-" + index}
                            >
                              <div className="relative bg-white w-fit">
                                Seleccionar medicación
                                <label className="">
                                  <input
                                    type="checkbox"
                                    className="hidden peer"
                                  />
                                  <i className="fa-solid fa-chevron-up transition-all peer-checked:rotate-180 text-sm" />
                                  <ul className="overflow-auto max-h-24 top-0 start-0 bg-white hidden peer-checked:block">
                                    <VerticalScroller
                                      url={String(
                                        process.env.REACT_APP_API_URL +
                                          "/getDrugs"
                                      )}
                                      renderModel={(registro, i) =>
                                        optionsModel(registro, i, index)
                                      }
                                      empty={<li>No hay drogas disponibles</li>}
                                    />
                                  </ul>
                                </label>
                              </div>
                              <input
                                type="number"
                                step={0.01}
                                name={"amount"}
                                onChange={(e) =>
                                  handleDrugChange(e, index, "amount")
                                }
                                placeholder="Cantidad (gramos)"
                                className="transition-all outline-blue-600 focus:outline-offset-2"
                              />
                              <input
                                type="text"
                                name={"time"}
                                onChange={(e) =>
                                  handleDrugChange(e, index, "time")
                                }
                                placeholder="Cada cuanto"
                                className="transition-all outline-blue-600 focus:outline-offset-2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    title="Debe seleccionar consulta en el Historial de Consultas"
                    type="submit"
                    value="...Registrar diagnostico"
                    className="cursor-pointer absolute end-0 bottom-0 italic underline underline-offset-4 text-blue-600"
                  />
                </div>
              }
            />
          </form>
        </div>
        <div>
          <Section txt="Diagnósticos Pasados" scheme={userConfig.theme} />
          <VerticalScroller
            url={String(process.env.REACT_APP_API_URL + "/getResults")}
            renderModel={treatModel}
            empty="No tenes diagnosticos listados"
          />
        </div>
      </div>
    </>
  );
};

export default Treatments;
