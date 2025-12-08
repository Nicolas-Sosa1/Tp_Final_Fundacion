import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../css/admin/AddDog.module.css";
import { useState, useEffect } from "react";

const AddDog = ({ listaPerros, setListaPerros, me, logOut }) => {
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
        castrado: "",
        vacunas: [],
        desparasitado: "",
        discapacidad: "",
        imagen: "",
        historia: "",
        tamaño: "Mediano",
        ubicacion: "Garin",
        tipoIngreso: "",
        estadoGeneral: true
    });

    const [errors, setErrors] = useState({});

    const sendData = (e) => {
        e.preventDefault();
        const URL = "http://localhost:8000/api/animals/new";

        axios.post(URL, data, { headers: { token_user: localStorage.getItem("token_user") } })
            .then(response => {
                setListaPerros([...listaPerros, response.data]);
                navigate("/home");
            })
            .catch(e => {
                if (e.response?.status === 406) logOut();
                setErrors(e.response?.data?.errors || {});
            });
    };

    const updateState = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const getData = () => {
        const URL = "http://localhost:8000/api/vacunas";
        axios.get(URL, { headers: { token_user: localStorage.getItem("token_user") } })
            .then(response => setListaVacunas(response.data))
            .catch(() => logOut());
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imgURL = URL.createObjectURL(file);
        setData(prevData => ({
            ...prevData,
            imagen: imgURL
        }));
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.wrapper}>
            <h2 className="title_orange mt-5">Agrega a tu perro</h2>

            <div className={styles.cardForm}>
                <form onSubmit={sendData} className={styles.formContainer}>
                    <div className={styles.progress_container}>
                        <div
                            className={styles.progress}
                            style={{ transform: `translateY(-50%) scaleX(${progressPercent})` }}
                        ></div>

                        <ol>
                            <li className={currentStep > 1 ? styles.done : ""}>Datos básicos</li>
                            <li className={currentStep === 2 ? styles.current : currentStep > 2 ? styles.done : ""}>Salud</li>
                            <li className={currentStep === 3 ? styles.current : ""}>Presentación</li>
                        </ol>
                    </div>

                    {currentStep === 1 && (
                        <>
                            <div className={styles.subform}>
                                <div className="d-flex flex-column mb-5">
                                    <label className="title_orange mx-3">Nombre:</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={data.nombre}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    />
                                    {errors.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
                                </div>

                                <div className="d-flex flex-column mb-5">
                                    <label className="title_orange mx-3">Edad:</label>
                                    <input
                                        type="number"
                                        name="edad"
                                        value={data.edad}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    />
                                    {errors.edad && <p className={styles.errorText}>{errors.edad}</p>}
                                </div>
                            </div>

                            <div className={styles.subform}>
                                <div>
                                    <label className="title_orange mx-4">Sexo:</label>
                                    <div className={styles.contenedor_genero}>
                                        <label className={data.sexo === "Hembra" ? styles.hembra : styles.opcion}>
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="Hembra"
                                                checked={data.sexo === "Hembra"}
                                                onChange={updateState}
                                            />
                                            <span>Hembra</span>
                                        </label>

                                        <label className={data.sexo === "Macho" ? styles.macho : styles.opcion}>
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="Macho"
                                                checked={data.sexo === "Macho"}
                                                onChange={updateState}
                                            />
                                            <span>Macho</span>
                                        </label>
                                    </div>
                                    {errors.sexo && <p className={styles.errorText}>{errors.sexo}</p>}
                                </div>

                                <div className="d-flex flex-column mb-3 w-100">
                                    <label className="title_orange text-start me-3">Peso (kg):</label>
                                    <input
                                        type="number"
                                        name="peso"
                                        value={data.peso}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    />
                                    {errors.peso && <p className={styles.errorText}>{errors.peso}</p>}
                                </div>
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
                                        className={`background-transparent-orange text-black-title font-400 rounded border-orange px-3 ${styles.inputFull}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                    {errors.castrado && <p className={styles.errorText}>{errors.castrado}</p>}
                                </div>

                                <div>
                                    <label className="title_orange">Desparasitado:</label>
                                    <select
                                        name="desparasitado"
                                        value={data.desparasitado}
                                        onChange={(e) =>
                                            setData({ ...data, desparasitado: e.target.value === "true" })
                                        }
                                        className={`background-transparent-orange text-black-title font-400 rounded border-orange px-3 ${styles.inputFull}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                    {errors.desparasitado && <p className={styles.errorText}>{errors.desparasitado}</p>}
                                </div>
                            </div>

                            <div className={styles.subform}>
                                <div className="d-flex flex-column mt-5">
                                    <label className="title_orange mb-1">Discapacidad:</label>
                                    <input
                                        type="text"
                                        name="discapacidad"
                                        value={data.discapacidad}
                                        onChange={updateState}
                                        className={`background-transparent-orange text-black-title font-400 rounded border-orange px-3 ${styles.inputFull}`}
                                    />
                                    {errors.discapacidad && (
                                        <p className={styles.errorText}>{errors.discapacidad}</p>
                                    )}
                                </div>

                                <div className="d-flex flex-column mt-5">
                                    <label className="title_orange w-100">Vacunas:</label>
                                    <div className="d-flex justify-content-evenly flex-wrap gap-3">
                                        {listaVacunas?.map((v) => (
                                            <label key={v._id} className="d-flex align-items-center gap-1 title_orange">
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
                            </div>
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <div className={styles.subform}>
                                <div className="d-flex flex-column">
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
                                    {errors.imagen && <p className={styles.errorText}>{errors.imagen}</p>}
                                </div>

                                <div className="d-flex flex-column mt-4">
                                    <label className="title_orange w-100">Tipo de ingreso:</label>
                                    <select
                                        name="tipoIngreso"
                                        value={data.tipoIngreso}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="adopcion">Adopción</option>
                                        <option value="transito">Tránsito</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center align-items-center w-100 mt-3">
                                <label className="title_orange me-3">Historia:</label>
                                <textarea
                                    className="background-transparent-orange text-black-title w-50 font-400 px-3 rounded border-orange"
                                    style={{ height: "100px" }}
                                    value={data.historia}
                                    onChange={(e) => setData({ ...data, historia: e.target.value })}
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
                            <button type="submit" className="px-3 rounded btn btn-success text-white">
                                Agregar perro
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))}
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

export default AddDog;
