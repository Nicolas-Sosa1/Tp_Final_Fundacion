import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../css/admin/NewAnimal.module.css";
import { useState, useEffect } from "react";

const NewAnimal = ({ listaPerros, setListaPerros, me, logOut }) => {
  const navigate = useNavigate();
  const [listaVacunas, setListaVacunas] = useState([]);

  const [data, setData] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    peso: "",
    castrado: false,
    vacunas: [],
    desparasitado: false,
    discapacidad: "",
    imagen: "",
    tipoIngreso: "",
  });

  const [errors, setErrors] = useState({});

  const sendData = (e) => {
    e.preventDefault();
    const URL = "http://localhost:8000/api/animals/new";

    axios
      .post(URL, data, {
        headers: { token_user: localStorage.getItem("token_user") },
      })
      .then((response) => {
        setListaPerros([...listaPerros, response.data]);
        navigate("/home");
      })
      .catch((e) => {
        if (e.response?.status === 406) {
          logOut();
        }
        setErrors(e.response?.data?.errors || {});
      });
  };

  const updateState = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const getData = () => {
    const URL = "http://localhost:8000/api/vacunas";
    axios
      .get(URL, { headers: { token_user: localStorage.getItem("token_user") } })
      .then((response) => {
        setListaVacunas(response.data);
      })
      .catch((e) => {
        logOut();
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <form onSubmit={sendData} className={styles.formContainer}>
      <h1 className={styles.titulo}>Agregar Animal</h1>
      <div className={styles.formGroup}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={updateState}
          className={styles.inputField}
        />
        {errors?.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Edad:</label>
        <input
          type="number"
          name="edad"
          value={data.edad}
          onChange={updateState}
          className={styles.inputField}
        />
        {errors.edad && <p className={styles.errorText}>{errors.edad}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Sexo:</label>
        <select
          name="sexo"
          value={data.sexo}
          onChange={updateState}
          className={styles.inputField}
        >
          <option value="">Seleccionar</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
        {errors.sexo && <p className={styles.errorText}>{errors.sexo}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Peso (kg):</label>
        <input
          type="number"
          name="peso"
          value={data.peso}
          onChange={updateState}
          className={styles.inputField}
        />
        {errors.peso && <p className={styles.errorText}>{errors.peso}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Castrado:</label>
        <select
          name="castrado"
          value={data.castrado}
          onChange={(e) =>
            setData({ ...data, castrado: e.target.value === "true" })
          }
          className={styles.inputField}
        >
          <option value="">Seleccionar</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        {errors.castrado && (
          <p className={styles.errorText}>{errors.castrado}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Desparasitado:</label>
        <select
          name="desparasitado"
          value={data.desparasitado}
          onChange={(e) =>
            setData({ ...data, desparasitado: e.target.value === "true" })
          }
          className={styles.inputField}
        >
          <option value="">Seleccionar</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        {errors.desparasitado && (
          <p className={styles.errorText}>{errors.desparasitado}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Vacunas:</label>
        <div className={styles.checkboxContainer}>
          {listaVacunas?.map((v) => (
            <label key={v._id}>
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
                      vacunas: data.vacunas.filter((id) => id !== v._id),
                    });
                  }
                }}
              />
              {v.nombre}
            </label>
          ))}
        </div>
        {errors.vacunas && <p className={styles.errorText}>{errors.vacunas}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Discapacidad:</label>
        <input
          type="text"
          name="discapacidad"
          value={data.discapacidad}
          onChange={updateState}
          className={styles.inputField}
        />
        {errors.discapacidad && (
          <p className={styles.errorText}>{errors.discapacidad}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>URL de imagen:</label>
        <input
          type="text"
          name="imagen"
          value={data.imagen}
          onChange={updateState}
          className={styles.inputField}
        />
        {errors.imagen && <p className={styles.errorText}>{errors.imagen}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Tipo de ingreso:</label>
        <select
          name="tipoIngreso"
          value={data.tipoIngreso}
          onChange={updateState}
          className={styles.inputField}
        >
          <option value="">Seleccionar</option>
          <option value="adopcion">Adopción</option>
          <option value="transito">Tránsito</option>
        </select>
        {errors.tipoIngreso && (
          <p className={styles.errorText}>{errors.tipoIngreso}</p>
        )}
      </div>

      <button className={styles.buttonAgregar}>Agregar</button>
    </form>
  );
};

export default NewAnimal;
