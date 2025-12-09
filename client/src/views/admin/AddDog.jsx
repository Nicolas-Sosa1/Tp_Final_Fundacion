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
    const [fileImage, setFileImage] = useState(null);

    const [data, setData] = useState({
        nombre: "",
        edad: "",
        sexo: "Hembra",
        peso: "",
        castrado: "false",
        vacunas: [],
        desparasitado: "false",
        discapacidad: "",
        imagen: "",
        historia: "",
        tamaño: "Mediano",
        ubicacion: "Garin",
        tipoIngreso: "",
        estadoGeneral: true
    });

    const [errors, setErrors] = useState({});

    const handleNextStep = (e) => {
        e.preventDefault();
        if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
    };

    const sendData = (e) => {
        e.preventDefault();
        const URL = "http://localhost:8000/api/animals/new";

        const formData = new FormData();
        const currentErrors = {};

        if (fileImage) {
            formData.append("imagen", fileImage);
        } else {
            currentErrors.imagen = "La imagen es obligatoria.";
        }

        formData.append("nombre", data.nombre);
        formData.append("edad", data.edad);
        formData.append("sexo", data.sexo);
        formData.append("peso", data.peso.toString());
        formData.append("discapacidad", data.discapacidad);
        formData.append("historia", data.historia);
        formData.append("tamaño", data.tamaño);
        formData.append("ubicacion", data.ubicacion);
        formData.append("tipoIngreso", data.tipoIngreso);

        formData.append("castrado", data.castrado);
        formData.append("desparasitado", data.desparasitado);
        formData.append("estadoGeneral", data.estadoGeneral ? "true" : "false");

        formData.append("vacunas", JSON.stringify(data.vacunas));

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        axios
            .post(URL, formData, {
                headers: { token_user: localStorage.getItem("token_user") },
            })
            .then((response) => {
                setListaPerros([...listaPerros, response.data]);
                navigate("/home");
            })
            .catch((e) => {
                if (e.response?.status === 406) logOut();

                const backendErrors = e.response?.data?.errors || {};

                if (
                    backendErrors.nombre ||
                    backendErrors.edad ||
                    backendErrors.sexo ||
                    backendErrors.peso
                ) {
                    setCurrentStep(1);
                } else if (
                    backendErrors.castrado ||
                    backendErrors.desparasitado ||
                    backendErrors.discapacidad ||
                    backendErrors.vacunas
                ) {
                    setCurrentStep(2);
                } else if (
                    backendErrors.imagen ||
                    backendErrors.historia ||
                    backendErrors.tamaño ||
                    backendErrors.ubicacion ||
                    backendErrors.tipoIngreso
                ) {
                    setCurrentStep(3);
                }

                setErrors(backendErrors);
            });
    };

    const updateState = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const getData = () => {
        axios
            .get("http://localhost:8000/api/vacunas", {
                headers: { token_user: localStorage.getItem("token_user") },
            })
            .then((response) => setListaVacunas(response.data))
            .catch(() => logOut());
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileImage(file);

        const imgURL = URL.createObjectURL(file);
        setData((prevData) => ({ ...prevData, imagen: imgURL }));

        setErrors((prevErrors) => {
            const { imagen, ...rest } = prevErrors;
            return rest;
        });
    };

    const handleVacunasChange = (e, vacunaId) => {
        const checked = e.target.checked;
        setData((prevData) => ({
            ...prevData,
            vacunas: checked
                ? [...prevData.vacunas, vacunaId]
                : prevData.vacunas.filter((id) => id !== vacunaId),
        }));
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.wrapper}>
            <h2 className="title_orange mt-5">Agrega a tu perro</h2>

            <div className={styles.cardForm}>
                <form
                    onSubmit={currentStep === totalSteps ? sendData : handleNextStep}
                    className={styles.formContainer}
                >
                    <div className={styles.progress_container}>
                        <div
                            className={styles.progress}
                            style={{
                                transform: `translateY(-50%) scaleX(${progressPercent})`,
                            }}
                        ></div>

                        <ol>
                            <li className={currentStep > 1 ? styles.done : ""}>Datos básicos</li>
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

                    {/* ---------- STEP 1 COMPLETO ---------- */}
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
                                    {errors.nombre && (
                                        <p className={styles.errorText}>{errors.nombre}</p>
                                    )}
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
                                                data.sexo === "Hembra"
                                                    ? styles.hembra
                                                    : styles.opcion
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
                                                data.sexo === "Macho"
                                                    ? styles.macho
                                                    : styles.opcion
                                            }
                                        >
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
                                    {errors.sexo && (
                                        <p className={styles.errorText}>{errors.sexo}</p>
                                    )}
                                </div>

                                <div className="d-flex flex-column mb-3 w-100">
                                    <label className="title_orange text-start me-3">
                                        Peso (kg):
                                    </label>
                                    <input
                                        type="number"
                                        name="peso"
                                        value={data.peso}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    />
                                    {errors.peso && (
                                        <p className={styles.errorText}>{errors.peso}</p>
                                    )}
                                </div>
                            </div>

                            {/* NUEVO: TAMAÑO */}
                            <div className={styles.subform}>
                                <div className="d-flex flex-column mb-5 w-100">
                                    <label className="title_orange mx-3">Tamaño:</label>
                                    <select
                                        name="tamaño"
                                        value={data.tamaño}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
                                    >
                                        <option value="Pequeño">Pequeño</option>
                                        <option value="Mediano">Mediano</option>
                                        <option value="Grande">Grande</option>
                                    </select>
                                    {errors.tamaño && (
                                        <p className={styles.errorText}>{errors.tamaño}</p>
                                    )}
                                </div>

                                {/* NUEVO: UBICACIÓN */}
                                <div className="d-flex flex-column mb-5 w-100">
                                    <label className="title_orange mx-3">Ubicación:</label>
                                    <select
                                        name="ubicacion"
                                        value={data.ubicacion}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 rounded border-orange px-3 w-100"
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
                                    {errors.ubicacion && (
                                        <p className={styles.errorText}>{errors.ubicacion}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ---------- STEP 2 ---------- */}
                    {currentStep === 2 && (
                        <>
                            <div className={styles.subform}>
                                <div>
                                    <label className="title_orange">Castrado:</label>
                                    <select
                                        name="castrado"
                                        value={data.castrado}
                                        onChange={updateState}
                                        className={`background-transparent-orange text-black-title font-400 rounded border-orange px-3 ${styles.inputFull}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                    {errors.castrado && (
                                        <p className={styles.errorText}>{errors.castrado}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="title_orange">Desparasitado:</label>
                                    <select
                                        name="desparasitado"
                                        value={data.desparasitado}
                                        onChange={updateState}
                                        className={`background-transparent-orange text-black-title font-400 rounded border-orange px-3 ${styles.inputFull}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                    {errors.desparasitado && (
                                        <p className={styles.errorText}>{errors.desparasitado}</p>
                                    )}
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
                                            <label
                                                key={v._id}
                                                className="d-flex align-items-center gap-1 title_orange"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={v._id}
                                                    checked={data.vacunas.includes(v._id)}
                                                    onChange={(e) =>
                                                        handleVacunasChange(e, v._id)
                                                    }
                                                />
                                                {v.nombre}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.vacunas && (
                                        <p className={styles.errorText}>{errors.vacunas}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ---------- STEP 3 ---------- */}
                    {currentStep === 3 && (
                        <>
                            <div className={styles.subform}>
                                <div className="d-flex flex-column">
                                    <label className="title_orange me-3">Imagen:</label>
                                    <label htmlFor="upload" className={styles.btn_subir}>
                                        {fileImage
                                            ? `Subida: ${fileImage.name}`
                                            : "Subir imagen"}
                                    </label>

                                    <input
                                        id="upload"
                                        type="file"
                                        name="imagen"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />

                                    {data.imagen && !errors.imagen && (
                                        <img
                                            src={data.imagen}
                                            alt="Previsualización"
                                            className={styles.imagePreview}
                                            style={{
                                                maxWidth: "100px",
                                                maxHeight: "100px",
                                                marginTop: "10px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}

                                    {errors.imagen && (
                                        <p className={styles.errorText}>{errors.imagen}</p>
                                    )}
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
                                    {errors.tipoIngreso && (
                                        <p className={styles.errorText}>{errors.tipoIngreso}</p>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-3">
                                <label className="title_orange me-3 w-100 text-start mb-1">
                                    Historia:
                                </label>
                                <textarea
                                    name="historia"
                                    className="background-transparent-orange text-black-title w-100 font-400 px-3 rounded border-orange"
                                    style={{ height: "100px" }}
                                    value={data.historia}
                                    onChange={updateState}
                                />
                                {errors.historia && (
                                    <p className={styles.errorText}>{errors.historia}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="d-flex align-items-center justify-content-end mt-4 mx-5">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep((prev) => Math.max(prev - 1, 1))
                                }
                                className="px-3 rounded btn btn-orange text-white mx-3"
                            >
                                Anterior
                            </button>
                        )}

                        {currentStep === totalSteps ? (
                            <button
                                type="submit"
                                className="px-3 rounded btn btn-success text-white"
                            >
                                Agregar perro
                            </button>
                        ) : (
                            <button
                                type="submit"
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