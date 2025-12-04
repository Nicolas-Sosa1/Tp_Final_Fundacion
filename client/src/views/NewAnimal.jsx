import axios from "axios"
import { useNavigate } from "react-router-dom";
import styles from '../css/NewAnimal.module.css'
import { useState, useEffect } from "react";


const NewAnimal = ({ listaPerros, setListaPerros, me, logOut }) => {

    const navigate = useNavigate();
    const [listaVacunas, setListaVacunas] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const progressPercent = (currentStep - 1) / (totalSteps - 1);


    const [data, setData] = useState({
        nombre: "",
        edad: "",
        sexo: "hembra",
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

        axios.post(URL, data, { headers: { token_user: localStorage.getItem("token_user") } }).then(response => {

            setListaPerros([...listaPerros, response.data]);
            navigate("/home");
        }
        ).catch(e => {
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
        const URL = ("http://localhost:8000/api/vacunas")
        axios.get(URL, { headers: { token_user: localStorage.getItem("token_user") } }).then(
            response => {
                setListaVacunas(response.data)
            }
        ).catch(
            e => {
                logOut()
            }
        )
    }
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("Solo puedes seleccionar hasta 5 imágenes");
            return;
        }

        const imageURLs = files.map((file) => URL.createObjectURL(file));

        setData((prevData) => ({
            ...prevData,
            imagen: imageURLs,
        }));
    };

    useEffect(() => {
        getData()

    }, []);


    return (

        <div className="d-flex flex-column justify-content-between align-items-start w-50 w-md-75 w-lg-50 shadow-lg rounded-5 p-5 mx-auto" style={{ height: "auto" }}>

            <form onSubmit={sendData} className={styles.formContainer}>
                <div className={styles.progress_container}>
                    <div
                        className={styles.progress}
                        style={{ transform: `translateY(-50%) scaleX(${progressPercent})` }}
                    ></div>

                    <ol>
                        <li className={currentStep > 1 ? styles.done : ""}>Datos básicos</li>
                        <li className={currentStep === 2 ? styles.current : (currentStep > 2 ? styles.done : "")}>Salud</li>
                        <li className={currentStep === 3 ? styles.current : ""}>Presentacion</li>
                    </ol>
                </div>
                {currentStep === 1 && (
                    <>
                        <div className={styles.subform}>
                            <div className="d-flex flex-column mb-5">
                                <div className="d-flex justify-content-start w-100  ">
                                    <label className="title_orange mx-3 ">Nombre:</label>
                                    <input type="text" name="nombre" value={data.nombre} onChange={updateState} className="background-transparent-orange text-black-title  font-400 font-15 rounded border-orange px-3 w-100" />
                                </div>
                                {errors?.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
                            </div>

                            <div className="d-flex flex-column mb-5">
                                <div className="d-flex justify-content-start w-100  ">
                                    <label className="title_orange mx-3 ">Edad:</label>
                                    <input type="number" name="edad" value={data.edad} onChange={updateState} className="background-transparent-orange text-black-title  font-400 font-15 rounded border-orange px-3 w-100" />
                                </div>
                                {errors.edad && <p className={styles.errorText}>{errors.edad}</p>}
                            </div>
                        </div>

                        <div className={styles.subform}>
                            <div className="">
                                <label className="title_orange mx-4">Sexo:</label>
                                <div className={styles.contenedor_genero}>
                                    <label className={data.sexo === "hembra" ? styles.hembra : styles.opcion}>
                                        <input
                                            type="radio"
                                            name="sexo"
                                            value="hembra"
                                            checked={data.sexo === "hembra"}
                                            onChange={updateState}
                                        />
                                        <span>Hembra</span>
                                    </label>

                                    <label className={data.sexo === "macho" ? styles.macho : styles.opcion}>
                                        <input
                                            type="radio"
                                            name="sexo"
                                            value="macho"
                                            onChange={updateState}
                                        />
                                        <span>Macho</span>
                                    </label>

                                </div>
                                {errors.sexo && <p className={styles.errorText}>{errors.sexo}</p>}
                            </div>

                            <div className="d-flex flex-row justify-content-end align-items-center">
                                <div className="d-flex justify-content-start w-100 mb-3">
                                    <label className="title_orange text-start me-3">Peso (kg):</label>

                                    <input
                                        type="number"
                                        name="peso"
                                        value={data.peso}
                                        onChange={updateState}
                                        className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 flex-grow-1"
                                    />
                                </div>

                                {errors.peso && <p className={styles.errorText}>{errors.peso}</p>}
                            </div>


                        </div>

                    </>
                )}
                {currentStep === 2 && (
                    <>
                        <div className={styles.subform}>
                            <div >
                                <label className="title_orange">Castrado:</label>
                                <select
                                    name="castrado"
                                    value={data.castrado}
                                    onChange={(e) => setData({ ...data, castrado: e.target.value === "true" })}
                                    className={`background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 ${styles.inputFull}`}
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
                                    onChange={(e) => setData({ ...data, desparasitado: e.target.value === "true" })}
                                    className={`background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 ${styles.inputFull}`}
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
                                <div className="d-flex justify-content-start w-100">
                                    <label className="title_orange mb-1">Discapacidad:</label>

                                    <input
                                        type="text"
                                        name="discapacidad"
                                        value={data.discapacidad}
                                        onChange={updateState}
                                        className={`background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 ${styles.inputFull}`}
                                    />

                                </div>

                                {errors.discapacidad && (
                                    <p className={styles.errorText} style={{ marginTop: '4px', width: '400px' }}>
                                        {errors.discapacidad}
                                    </p>
                                )}
                            </div>


                            <div className="d-flex flex-column mt-5">
                                <label className="title_orange w-100">Vacunas:</label>
                                <div className="d-flex justify-content-evenly flex-wrap gap-3">
                                    {listaVacunas?.map((v) => (
                                        <label key={v._id} className="d-flex align-items-center gap-1 title_orange ">
                                            <input
                                                type="checkbox"
                                                value={v._id}
                                                checked={data.vacunas.includes(v._id)}
                                                className={styles.background_transparent_input}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData({
                                                            ...data,
                                                            vacunas: [...data.vacunas, v._id],
                                                        });
                                                    } else {
                                                        setData({
                                                            ...data,
                                                            vacunas: data.vacunas.filter(id => id !== v._id),
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


                    </>)}
                {currentStep === 3 && (
                    <>
                        <div className={styles.subform}>
                            <div className="d-flex flex-column ">
                                <div className="d-flex justify-content-start w-100">
                                    <label className="title_orange me-3">URL de imagen:</label>
                                    <div className="d-flex">
                                        <label htmlFor="upload" className={styles.btn_subir}>
                                            Subir imágenes
                                        </label>

                                        <input
                                            id="upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>


                                </div>
                                {errors.imagen && <p className={styles.errorText}>{errors.imagen}</p>}
                            </div>


                            <div className="d-flex flex-column ">
                                <div className="d-flex justify-content-start w-100">
                                    <label className="title_orange w-100">Tipo de ingreso:</label>
                                    <select name="tipoIngreso" value={data.tipoIngreso} onChange={updateState} className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-100" required>
                                        <option value="">Seleccionar</option>
                                        <option value="adopcion">Adopción</option>
                                        <option value="transito">Tránsito</option>
                                    </select>
                                </div>

                                {/* {errors.tipoIngreso && (<p className={styles.errorText}>{errors.tipoIngreso}</p>)} */}

                            </div>

                        </div>

                        <div className="d-flex   justify-content-center align-items-center w-100 mt-3 ">
                            <label className="title_orange me-3">Historia:</label>
                            <textarea className='background-transparent-orange text-black-title w-50 font-400 px-3 rounded border-orange no-scrollbar ' style={{ height: '100px' }} rows="5" cols="34" value={data.historia} onChange={(e) => setData({ ...data, historia: e.target.value })} />
                        </div>

                    </>)}
                <div className="d-flex align-items-center justify-content-end mt-4 mx-5">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                            className="px-3 rounded btn  btn-orange text-white mx-3"
                        >
                            Anterior
                        </button>
                    )}

                    {currentStep === 3 ? (
                        <button type="submit"
                            className="px-3 rounded btn btn-success text-white"
                        >
                            Agregar perro
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))}
                            className="px-3 rounded btn  btn-orange text-white"
                        >
                            Siguiente
                        </button>
                    )}
                </div>

            </form>
        </div>
    )

}

export default NewAnimal