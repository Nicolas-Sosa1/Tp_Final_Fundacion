import axios from "axios"
import { useNavigate } from "react-router-dom";
import styles from '../css/Form.module.css'
import { useState, useEffect } from "react";


const Form = () => {

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 8;
    const progressPercent = (currentStep - 1) / (totalSteps - 1);

    const listaPerritos = [
        { nombre: "Luna", id: 1 },
        { nombre: "Milo", id: 2 },
        { nombre: "Toby", id: 3 }
    ];


    const questions = [
        // --- Información personal ---
        { id: 3, text: "Nombre completo" },
        { id: 4, text: "Edad" },
        { id: 5, text: "Zona" },
        { id: 6, text: "Dirección" },
        { id: 7, text: "Número de celular" },
        { id: 8, text: "Mail" },
        { id: 9, text: "Instagram y/o Facebook" },
        { id: 10, text: "¿Cuál es tu profesión y situación laboral actual?" },

        // --- Sobre la adopción ---
        { id: 1, text: "¿A cuál de nuestros rescatados querés adoptar?" },
        { id: 2, text: "En caso de que ya no esté disponible, ¿te interesaría adoptar a algún otro?" },
        { id: 11, text: "¿Por qué querés adoptar?" },

        // --- Hogar y convivencia ---
        { id: 12, text: "¿Vivís en casa o departamento? Detallá si tiene balcón, terraza o patio y el tipo de protección de cada uno" },
        { id: 13, text: "¿Con quién vivís? Indicá edad de cada uno y el parentesco" },
        { id: 20, text: "¿Todos los miembros del núcleo familiar están de acuerdo con adoptar? Por favor corroboralo antes de enviar el cuestionario" },
        { id: 21, text: "¿Vos o alguna de las personas que viven en la casa padecen de algún tipo de alergia?" },

        // --- Condiciones del hogar ---
        { id: 14, text: "¿El animal adoptado estaría muchas horas solo? Si los horarios varían por favor aclaralo" },
        { id: 15, text: "¿El animal viviría en interiores o exteriores? ¿En qué momentos? ¿Dónde dormiría?" },
        { id: 16, text: "¿Alquilás o sos propietario? En caso de ser alquiler, ¿te aseguraste de que se admitan mascotas?" },
        { id: 17, text: "Si debieras mudarte y no admitieran mascotas, ¿qué harías?" },

        // --- Rutinas y cuidados ---
        { id: 27, text: "¿Tenés tiempo para dedicarle a los paseos? ¿Cuántos harían por día? ¿Con o sin correa?" },
        { id: 18, text: "¿Qué pasaría con él si te vas de vacaciones?" },
        { id: 31, text: "¿Tenés en cuenta que necesitará un período de adaptación? Esto incluye romper, ladrar y/o llorar, sobre todo en cachorros" },

        // --- Situaciones económicas ---
        { id: 19, text: "En caso de quedarte sin trabajo, ¿hay alguien dispuesto a hacerse cargo de los gastos de manutención?" },
        { id: 30, text: "¿Tenés en cuenta el gasto que requiere tener un animal? Incluyendo vacunas, veterinario, comida de buena calidad y chapita identificadora" },

        // --- Mascotas actuales o anteriores ---
        { id: 23, text: "¿Tuviste o tenés otra mascota? En caso de haber tenido, ¿qué le pasó?" },
        { id: 24, text: "En caso de que tengas, ¿está/n castrado/s? Si la respuesta es NO, ¿por qué? ¿Tenés pensado hacerlo?" },
        { id: 25, text: "¿Estás de acuerdo con la castración? Si la respuesta es no, ¿por qué?" },
        { id: 26, text: "¿Tenés pensado castrar al animal que adoptes? Si la respuesta es NO, ¿asumirías el compromiso de hacerlo a los 7 meses igualmente?" },
        { id: 28, text: "En caso de tener más animales, ambos necesitarán un período de adaptación. ¿Estás de acuerdo con esto?" },

        // --- Consideraciones especiales ---
        { id: 22, text: "En caso de ser una pareja, ¿evaluaron qué pasaría con el animal si en algún momento decidieran separarse?" },
        { id: 29, text: "¿Tenés en cuenta que podría crecer más de lo esperado? ¿Qué harías si esto pasara?" }
    ];

    const updateState = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        nombre: "",
        edad: "",
        zona: "",
        direccion: "",
        nro_celular: "",
        mail: "",
        redSocialTipo: "",
        redSocialUser: "",
        profesion: "",
        adoptarA: "",

        adoptarOtro: "",
        motivo: "",


        convivientes: "",
        acuerdo: "",
        alergias: "",
        soloHoras: "",
        interiorExterior: "",
        alquiler: "",
        mudanza: "",

        paseos: "",
        vacaciones: "",
        adaptacion: "",

        horasSolo: "",
        vivienda: "", 


        responsableEmergencia: "",
        responsableNombre: "",
        responsableAcuerdo: "",
        gastosMascota: "",

        otrasMascotas: "",
        castracionActuales: "",
        acuerdoCastracion: "",
        castrarAdoptado: "",

        convivenciaAdaptacion: "", 
        parejaSeparacion: "",
        crecimientoImprevisto: ""
    });


    const sendData = (e) => {
        e.preventDefault();
        const URL = "http://localhost:8000/api/form/new";

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
    const [showList, setShowList] = useState(false);

    const filteredList = listaPerritos.filter(perro =>
        perro.nombre.toLowerCase().includes(data.adoptarA.toLowerCase())
    );



    return (

        <div className={styles.wrapper}>
            <h2 className="title_orange mb-5">Completa este formulario</h2>
            <div className={styles.cardForm}>
                <form onSubmit={sendData} className={styles.formContainer}>
                    <div className={styles.progress_container}>
                        <div
                            className={styles.progress}
                            style={{ transform: `translateY(-50%) scaleX(${progressPercent})` }}
                        ></div>

                        <ol>
                            <li className={currentStep === 1 ? styles.current : (currentStep > 1 ? styles.done : "")}>Información personal </li>
                            <li className={currentStep === 2 ? styles.current : (currentStep > 2 ? styles.done : "")}>Sobre la adopción</li>
                            <li className={currentStep === 3 ? styles.current : (currentStep > 3 ? styles.done : "")}>Hogar y convivencia</li>
                            <li className={currentStep === 4 ? styles.current : (currentStep > 4 ? styles.done : "")}>Condiciones del hogar</li>
                            <li className={currentStep === 5 ? styles.current : (currentStep > 5 ? styles.done : "")}>Rutinas y cuidados</li>
                            <li className={currentStep === 6 ? styles.current : (currentStep > 6 ? styles.done : "")}>Situación económica</li>
                            <li className={currentStep === 7 ? styles.current : (currentStep > 7 ? styles.done : "")}>Mascotas</li>
                            <li className={currentStep === 7 ? styles.current : (currentStep > 8 ? styles.done : "")}>Consideraciones</li>
                        </ol>
                    </div>
                    {currentStep === 1 && (
                        <>
                            <div className={styles.subform}>
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <input type="text" name="nombre" value={data.nombre} onChange={updateState} required />
                                        <label>Nombre Completo</label>
                                    </div>
                                </div>
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <input type="number" name="edad" value={data.edad} onChange={updateState} required />
                                        <label>Edad</label>
                                    </div>

                                </div>

                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <select
                                            name="zona"
                                            value={data.zona}
                                            onChange={updateState}
                                            required
                                            className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}

                                        >
                                            <option value="" disabled hidden></option>
                                            <option value="Garin">Garin</option>
                                            <option value="Jose C.Paz">José C. Paz</option>
                                            <option value="Pilar">Pilar</option>
                                        </select>
                                        <label>Zona</label>
                                    </div>


                                </div>
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <input type="text" name="direccion" value={data.direccion} onChange={updateState} className="bg-white text-black-title  font-400 font-15 rounded border-orang p-2e px-3 w-100" />
                                        <label>Dirección:</label>
                                    </div>
                                </div>
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <input type="number" name="nro_celular" value={data.nro_celular} onChange={updateState} className="bg-white text-black-title  font-400 font-15 rounded border-orang p-2e px-3 w-100" />
                                        <label>Nro Celular:</label>
                                    </div>
                                </div>
                                <div className="d-flex flex-column mb-3">

                                    <div className={styles.inputGroup}>
                                        <input type="text" name="mail" value={data.mail} onChange={updateState} className="bg-white text-black-title  font-400 font-15 rounded border-orang p-2e px-3 w-100" />
                                        <label>Mail:</label>
                                    </div>
                                </div>
                                <div className="d-flex flex-column mb-3">

                                    <div className={styles.inputGroup}>

                                        <select
                                            name="redSocialTipo"
                                            value={data.redSocialTipo}
                                            onChange={updateState}
                                            className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                        >
                                            <option value="">Seleccioná una</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="TikTok">TikTok</option>
                                            <option value="Twitter/X">Twitter/X</option>
                                            <option value="Otra">Otra</option>
                                        </select>
                                        <label>Red social:</label>
                                    </div>
                                </div>
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            name="redSocialUser"
                                            placeholder="Ej: @pepe.dev"
                                            value={data.redSocialUser}
                                            onChange={updateState}
                                            className="bg-white text-black-title font-400 font-15 rounded border-orange p-2 px-3 w-100"
                                        />
                                        <label>Usuario:</label>
                                    </div>


                                </div>
                                {(errors?.redSocialTipo || errors?.redSocialUser) && (
                                    <p className={styles.errorText}>
                                        {errors.redSocialTipo || errors.redSocialUser}
                                    </p>
                                )}
                                <div className="d-flex flex-column mb-3">
                                    <div className={styles.inputGroup}>
                                        <label className="title_orange mx-3">Profesión / situación laboral:</label>
                                        <input
                                            type="text"
                                            name="profesion"
                                            value={data.profesion}
                                            onChange={updateState}
                                            className="bg-white text-black-title font-400 font-15 rounded border-orange p-2 px-3 w-100"
                                            placeholder="Contá brevemente a qué te dedicás"
                                        />
                                    </div>
                                    {errors?.profesion && (
                                        <p className={styles.errorText}>{errors.profesion}</p>
                                    )}
                                </div>


                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <div className={styles.section}>
                            <div className="position-relative mb-4">
                                <label className="title_orange mx-2 mb-1">¿A cuál de nuestros rescatados querés adoptar?</label>

                                <input
                                    type="text"
                                    name="adoptarA"
                                    value={data.adoptarA}
                                    onChange={(e) => {
                                        updateState(e);
                                        setShowList(true);
                                    }}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                />
                                {showList && data.adoptarA.length > 0 && (
                                    <div
                                        className="position-absolute w-100 "
                                        style={{
                                            background: "white",
                                            border: "1px solid rgb(129, 129, 129)",
                                            borderRadius: "0 8px",
                                            zIndex: 1,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            top: "70px"
                                        }}
                                    >
                                        {filteredList.length > 0 ? (
                                            filteredList.map((perro) => (
                                                <div
                                                    key={perro.id}
                                                    onClick={() => {
                                                        setData({ ...data, adoptarA: perro.nombre });
                                                        setShowList(false);
                                                    }}
                                                    style={{
                                                        padding: "10px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #ffb36b",
                                                    }}
                                                >
                                                    {perro.nombre}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center">No encontrado</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">Si ya no está disponible, ¿te interesaría adoptar a otro?</label>
                                <select name="adoptarOtro" value={data.adoptarOtro} onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}>
                                    <option value="">Seleccionar</option>
                                    <option value="Si">Sí</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">¿Por qué querés adoptar?</label>
                                <textarea name="motivo" value={data.motivo} onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`} rows={3}></textarea>
                            </div>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div>
                            <div className={styles.subform}>


                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-1 mb-1">¿Con quién vivís?</label>

                                    <input type="text" name="convivientes" value={data.convivientes} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`} />
                                </div>

                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-1 mb-1">¿Todos están de acuerdo con adoptar?</label>
                                    <select name="acuerdo" value={data.acuerdo} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}>
                                        <option value="">Seleccionar</option>
                                        <option value="Si">Sí</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-1 mb-1">¿Hay alergias en la familia?</label>
                                    <select name="alergias" value={data.alergias} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}>
                                        <option value="">Seleccionar</option>
                                        <option value="Si">Sí</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-3 mb-1">¿Cuántas horas estaría solo?</label>
                                    <input type="number" name="soloHoras" value={data.soloHoras} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`} />
                                </div>

                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-3 mb-1">¿Vivirá en interior o exterior?</label>
                                    <input type="text" name="interiorExterior" value={data.interiorExterior} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`} />
                                </div>

                                <div className="d-flex flex-column mb-4">
                                    <label className="title_orange mx-2  mt-3 mb-1">¿Alquilás o sos propietario?</label>
                                    <select name="alquiler" value={data.alquiler} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}>
                                        <option value="">Seleccionar</option>
                                        <option value="Propietario">Propietario</option>
                                        <option value="Alquiler">Alquiler</option>
                                    </select>
                                </div>

                            </div>
                            <div className="d-flex justify-content-center align-items-center w-100 mb-4">
                                <div >
                                    <label className="title_orange mx-2 w-100 text-center mt-1">Si te mudás y no admiten mascotas, ¿qué harías?</label>
                                    <textarea name="mudanza" value={data.mudanza} onChange={updateState}
                                        className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}></textarea>
                                </div>
                            </div>
                        </div>


                    )}
                    {currentStep === 4 && (
                        <div className={styles.section}>
                            {/* { id: 27, text: "¿Tenés tiempo para dedicarle a los paseos? ¿Cuántos harían por día? ¿Con o sin correa?" },
        { id: 18, text: "¿Qué pasaría con él si te vas de vacaciones?" },
        { id: 31, text: "¿Tenés en cuenta que necesitará un período de adaptación? Esto incluye romper, ladrar y/o llorar, sobre todo en cachorros" }, */}
                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-2 mb-1">
                                    ¿Tenés tiempo para dedicarle a los paseos? ¿Cuántos harían por día? ¿Con o sin correa?
                                </label>
                                <textarea
                                    name="paseos"
                                    value={data.paseos}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">
                                    ¿Qué pasaría con él si te vas de vacaciones?
                                </label>
                                <textarea
                                    name="vacaciones"
                                    value={data.vacaciones}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">
                                    ¿Tenés en cuenta que necesitará un período de adaptación? Esto incluye romper, ladrar y/o llorar, sobre todo en cachorros.
                                </label>
                                <textarea
                                    name="adaptacion"
                                    value={data.adaptacion}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                        </div>
                    )}
                    {currentStep === 5 && (
                        <div className={styles.section}>
                            <div className="d-flex flex-column mb-3">
                                <label className="title_orange mx-2 mb-1">
                                    ¿El animal adoptado estaría muchas horas solo? Si los horarios varían por favor aclaralo.
                                </label>
                                <textarea
                                    name="horasSolo"
                                    value={data.horasSolo}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-3">
                                <label className="title_orange mx-2 mb-1">
                                    ¿El animal viviría en interiores o exteriores? ¿En qué momentos? ¿Dónde dormiría?
                                </label>
                                <textarea
                                    name="vivienda"
                                    value={data.vivienda}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-3">
                                <label className="title_orange mx-2 mb-1">
                                    ¿Alquilás o sos propietario? En caso de ser alquiler, ¿te aseguraste de que se admitan mascotas?
                                </label>
                                <textarea
                                    name="alquiler"
                                    value={data.alquiler}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-3">
                                <label className="title_orange mx-2 mb-1">
                                    Si debieras mudarte y no admitieran mascotas, ¿qué harías?
                                </label>
                                <textarea
                                    name="mudanza"
                                    value={data.mudanza}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                        </div>

                    )}
                    {currentStep === 6 && (
                        <div className={styles.section}>
                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">
                                    En caso de quedarte sin trabajo, ¿hay alguien que pueda hacerse cargo del animal?
                                </label>

                                <select
                                    name="responsableEmergencia"
                                    value={data.responsableEmergencia}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-15 rounded-3 border-orange p-2 ${styles.border_2}`}
                                >
                                    <option value="">Seleccioná una opción</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                    <option value="no_seguro">No estoy seguro/a</option>
                                </select>

                                <label className="title_orange mx-2 mt-3 mb-1">
                                    ¿Quién sería esa persona?
                                </label>
                                <input
                                    type="text"
                                    name="responsableNombre"
                                    value={data.responsableNombre}
                                    onChange={updateState}
                                    placeholder="Familiar, pareja, amigo, etc."
                                    className={`bg-white text-black-title font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                />

                                <label className="title_orange mx-2 mt-3 mb-1">
                                    ¿Esta persona sabe y está de acuerdo?
                                </label>
                                <select
                                    name="responsableAcuerdo"
                                    value={data.responsableAcuerdo}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-15 rounded-3 border-orange p-2 ${styles.border_2}`}
                                >
                                    <option value="">Seleccioná una opción</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-1 mb-1">
                                    ¿Tenés en cuenta el gasto que requiere tener un animal? Incluyendo vacunas, veterinario, comida de buena calidad y chapita identificadora.
                                </label>
                                <textarea
                                    name="gastosMascota"
                                    value={data.gastosMascota}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                        </div>
                    )}
                    {currentStep === 7 && (
                        <div className={styles.section}>
                            <div className="d-flex flex-column mb-1">
                                <label className="title_orange mx-2 mt-1 mb-1">
                                    ¿Tuviste o tenés otra mascota? En caso de haber tenido, ¿qué le pasó?
                                </label>
                                <textarea
                                    name="otrasMascotas"
                                    value={data.otrasMascotas}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-1 mb-1">
                                    En caso de que tengas, ¿está/n castrado/s? Si la respuesta es NO, ¿por qué? ¿Tenés pensado hacerlo?
                                </label>
                                <textarea
                                    name="castracionActuales"
                                    value={data.castracionActuales}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-1 mb-1">
                                    ¿Estás de acuerdo con la castración? Si la respuesta es no, ¿por qué?
                                </label>
                                <textarea
                                    name="acuerdoCastracion"
                                    value={data.acuerdoCastracion}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-1 mb-1">
                                    ¿Tenés pensado castrar al animal que adoptes? Si la respuesta es NO, ¿asumirías el compromiso de hacerlo a los 7 meses igualmente?
                                </label>
                                <textarea
                                    name="castrarAdoptado"
                                    value={data.castrarAdoptado}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>
                        </div>
                    )}
                    {currentStep === 8 && (
                        <div className={styles.section}>
                            <div className="d-flex flex-column mb-4 mt-3">
                                <label className="title_orange mx-2  mt-1 mb-1 mb-1"> En caso de tener más animales, ambos necesitarán un período de adaptación. ¿Estás de acuerdo con esto?</label>
                                <select name="convivenciaAdaptacion" value={data.convivenciaAdaptacion} onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}>
                                    <option value="">Seleccionar</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-1">
                                    En caso de ser una pareja, ¿evaluaron qué pasaría con el animal si en algún momento decidieran separarse?
                                </label>
                                <textarea
                                    name="parejaSeparacion"
                                    value={data.parejaSeparacion}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>

                            <div className="d-flex flex-column mb-4">
                                <label className="title_orange mx-2 mt-3 mb-3">
                                    ¿Tenés en cuenta que podría crecer más de lo esperado? ¿Qué harías si esto pasara?
                                </label>
                                <textarea
                                    name="crecimientoImprevisto"
                                    value={data.crecimientoImprevisto}
                                    onChange={updateState}
                                    className={`bg-white text-black-title font-400 font-15 rounded-3 border-orange p-2 w-100 ${styles.border_2}`}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    <div className="d-flex align-items-center justify-content-end mt-4 mx-5">
                        {currentStep > 1 && (
                            <button type="button" onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} className="px-3 rounded btn  btn-orange text-white mx-3">Anterior</button>
                        )}

                        {currentStep === 8 ? (
                            <button type="submit" className="px-3 rounded btn btn-success text-white">Agregar perro</button>
                        ) : (
                            <button type="button" onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))} className="px-3 rounded btn  btn-orange text-white">Siguiente</button>
                        )}
                    </div>

                </form>
            </div>
        </div>
    )

}

export default Form