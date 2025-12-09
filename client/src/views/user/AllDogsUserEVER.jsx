import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/AllDogsUser.module.css";
import { useState, useEffect } from "react";

const AllDogsUser = ({ listaPerros, setListaPerros, logOut }) => {
  const navigate = useNavigate();
  const [listaVacunas, setListaVacunas] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const progressPercent = (currentStep - 1) / (totalSteps - 1);

  const [data, setData] = useState({
    nombre: "",
    edad: "",
    sexo: "Hembra",
    peso: "",
    castrado: false,
    vacunas: [],
    desparasitado: false,
    discapacidad: "",
    imagen: "",
    historia: "",
    tamaño: "Mediano",
    ubicacion: "Garin",
    tipoIngreso: "",
    estadoGeneral: true,
  });

  const [errors, setErrors] = useState({});

  const updateState = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setData({
      ...data,
      imagen: imageURL,
    });
  };

  const getVacunas = () => {
    axios
      .get("http://localhost:8000/api/vacunas", {
        headers: { token_user: localStorage.getItem("token_user") },
      })
      .then((res) => setListaVacunas(res.data))
      .catch(() => logOut());
  };

  useEffect(() => {
    getVacunas();
  }, []);

  const sendData = (e) => {
    e.preventDefault();

    const URL = "http://localhost:8000/api/animals/new";

    const body = {
      nombre: data.nombre,
      edad: Number(data.edad),
      sexo: data.sexo,
      peso: Number(data.peso),
      castrado: data.castrado,
      vacunas: data.vacunas,
      desparasitado: data.desparasitado,
      discapacidad: data.discapacidad,
      imagen: data.imagen,
      historia: data.historia,
      tamaño: data.tamaño,
      ubicacion: data.ubicacion,
      tipoIngreso: data.tipoIngreso,
      estadoGeneral: true,
    };

    axios
      .post(URL, body, {
        headers: { token_user: localStorage.getItem("token_user") },
      })
      .then((response) => {
        setListaPerros([...listaPerros, response.data]);
        navigate("/home");
      })
      .catch((e) => {
        if (e.response?.status === 406) logOut();
        setErrors(e.response?.data?.errors || {});
      });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className="title_orange mt-5">Agrega a tu perro</h2>

      <div className={styles.cardForm}>
        <form onSubmit={sendData} className={styles.formContainer}>
          <div className={styles.progress_container}>
            <div
              className={styles.progress}
              style={{
                transform: `translateY(-50%) scaleX(${progressPercent})`,
              }}
            ></div>

            <ol>
              <li className={currentStep > 1 ? styles.done : ""}>
                Datos básicos
              </li>
              <li
                className={
                  currentStep === 2
                    ? styles.current
                    : currentStep > 2
                    ? styles.done
                    : ""
                }
              >
                Salud
              </li>
              <li className={currentStep === 3 ? styles.current : ""}>
                Presentación
              </li>
            </ol>
          </div>

          {currentStep === 1 && (
            <>
              <div className={styles.subform}>
                <div className="d-flex flex-column mb-5">
                  <div className="d-flex justify-content-start w-100">
                    <label className="title_orange mx-3">Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={data.nombre}
                      onChange={updateState}
                      className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                    />
                  </div>
                  {errors.nombre && (
                    <p className={styles.errorText}>{errors.nombre}</p>
                  )}
                </div>

                <div className="d-flex flex-column mb-5">
                  <div className="d-flex justify-content-start w-100">
                    <label className="title_orange mx-3">Edad:</label>
                    <input
                      type="number"
                      name="edad"
                      value={data.edad}
                      onChange={updateState}
                      className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                    />
                  </div>
                  {errors.edad && (
                    <p className={styles.errorText}>{errors.edad}</p>
                  )}
                </div>
              </div>

              <div className={styles.subform}>
                <div>
                  <label className="title_orange mx-4">Sexo:</label>
                  <div className={styles.contenedor_genero}>
                    <label
                      className={
                        data.sexo === "Hembra" ? styles.hembra : styles.opcion
                      }
                    >
                      <input
                        type="radio"
                        name="sexo"
                        value="Hembra"
                        checked={data.sexo === "Hembra"}
                        onChange={updateState}
                      />
                      <span>Hembra</span>
                    </label>

                    <label
                      className={
                        data.sexo === "Macho" ? styles.macho : styles.opcion
                      }
                    >
                      <input
                        type="radio"
                        name="sexo"
                        value="Macho"
                        onChange={updateState}
                      />
                      <span>Macho</span>
                    </label>
                  </div>
                  {errors.sexo && (
                    <p className={styles.errorText}>{errors.sexo}</p>
                  )}
                </div>

                <div className="d-flex flex-row justify-content-end align-items-center">
                  <div className="d-flex justify-content-start w-100 mb-3">
                    <label className="title_orange text-start me-3">
                      Peso (kg):
                    </label>

                    <input
                      type="number"
                      name="peso"
                      value={data.peso}
                      onChange={updateState}
                      className="background-transparent-orange text-black-title rounded border-orange px-3 flex-grow-1"
                    />
                  </div>

                  {errors.peso && (
                    <p className={styles.errorText}>{errors.peso}</p>
                  )}
                </div>
              </div>

              <div className={styles.subform}>
                <label className="title_orange mx-3">Tamaño:</label>
                <select
                  name="tamaño"
                  value={data.tamaño}
                  onChange={updateState}
                  className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                >
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className={styles.subform}>
                <label className="title_orange mx-3">Ubicación:</label>
                <select
                  name="ubicacion"
                  value={data.ubicacion}
                  onChange={updateState}
                  className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                >
                  <option value="Garin">Garin</option>
                  <option value="Jose C. Paz">Jose C. Paz</option>
                  <option value="Pilar">Pilar</option>
                  <option value="Escobar">Escobar</option>
                  <option value="Tigre">Tigre</option>
                  <option value="San Miguel">San Miguel</option>
                  <option value="Malvinas Argentinas">
                    Malvinas Argentinas
                  </option>
                </select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className={styles.subform}>
                <div>
                  <label className="title_orange">Castrado:</label>
                  <select
                    name="castrado"
                    value={data.castrado}
                    onChange={(e) =>
                      setData({ ...data, castrado: e.target.value === "true" })
                    }
                    className={`background-transparent-orange text-black-title rounded border-orange px-3 ${styles.inputFull}`}
                  >
                    <option value="">Seleccionar</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="title_orange">Desparasitado:</label>
                  <select
                    name="desparasitado"
                    value={data.desparasitado}
                    onChange={(e) =>
                      setData({
                        ...data,
                        desparasitado: e.target.value === "true",
                      })
                    }
                    className={`background-transparent-orange text-black-title rounded border-orange px-3 ${styles.inputFull}`}
                  >
                    <option value="">Seleccionar</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className={styles.subform}>
                <label className="title_orange">Discapacidad:</label>
                <input
                  type="text"
                  name="discapacidad"
                  value={data.discapacidad}
                  onChange={updateState}
                  className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                />
                {errors.discapacidad && (
                  <p className={styles.errorText}>{errors.discapacidad}</p>
                )}
              </div>

              <div className={styles.subform}>
                <label className="title_orange w-100">Vacunas:</label>
                <div className="d-flex justify-content-evenly flex-wrap gap-3">
                  {listaVacunas.map((v) => (
                    <label
                      key={v._id}
                      className="d-flex align-items-center gap-1 title_orange"
                    >
                      <input
                        type="checkbox"
                        value={v._id}
                        checked={data.vacunas.includes(v._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData({
                              ...data,
                              vacunas: [...data.vacunas, v._id],
                            });
                          } else {
                            setData({
                              ...data,
                              vacunas: data.vacunas.filter(
                                (id) => id !== v._id
                              ),
                            });
                          }
                        }}
                      />
                      {v.nombre}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className={styles.subform}>
                <label className="title_orange me-3">Imagen:</label>

                <label htmlFor="upload" className={styles.btn_subir}>
                  Subir imagen
                </label>

                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />

                {errors.imagen && (
                  <p className={styles.errorText}>{errors.imagen}</p>
                )}
              </div>

              <div className={styles.subform}>
                <label className="title_orange w-100">Tipo de ingreso:</label>
                <select
                  name="tipoIngreso"
                  value={data.tipoIngreso}
                  onChange={updateState}
                  className="background-transparent-orange text-black-title rounded border-orange px-3 w-100"
                >
                  <option value="">Seleccionar</option>
                  <option value="adopcion">Adopción</option>
                  <option value="transito">Tránsito</option>
                </select>
              </div>

              <div className="d-flex justify-content-center align-items-center w-100 mt-3">
                <label className="title_orange me-3">Historia:</label>
                <textarea
                  className="background-transparent-orange text-black-title w-50 rounded border-orange px-3"
                  rows="4"
                  value={data.historia}
                  onChange={(e) =>
                    setData({ ...data, historia: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="d-flex align-items-center justify-content-end mt-4 mx-5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="px-3 rounded btn btn-orange text-white mx-3"
              >
                Anterior
              </button>
            )}

            {currentStep === 3 ? (
              <button
                type="submit"
                className="px-3 rounded btn btn-success text-white"
              >
                Agregar perro
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
                }
                className="px-3 rounded btn btn-orange text-white"
              >
                Siguiente
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllDogsUser;
