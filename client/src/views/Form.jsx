import axios from "axios"
import { useNavigate, useParams } from "react-router-dom";
import styles from '../css/Form.module.css'
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Form = () => {
    const navigate = useNavigate();
    const { tipo } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const progressPercent = (currentStep - 1) / (totalSteps - 1);
    
    const [listaAnimales, setListaAnimales] = useState([]);
    const [showList, setShowList] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadingAnimales, setLoadingAnimales] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formType = tipo || "adopcion";

    const [data, setData] = useState({
        nombre: "",
        apellido: "",
        edad: "",
        zona: "",
        direccion: "",
        telefono: "",
        mail: "",
        profesion: "",
        adoptarA: "",
        animalId: "",
        adoptarOtro: "",
        motivoAdopcion: "",
        convivientes: "",
        experienciaConAnimales: "",
        viviendaTipo: "casa",
        tienePatio: "si",
        otrasMascotas: "",
        aptoEconomicamente: "si",
        horasFueraDeCasa: 8,
        soloHoras: "",
        interiorExterior: "",
        alquiler: "",
        paseos: "",
        vacaciones: "",
        gastosMascota: "",
        acuerdoCastracion: "",
        compromiso: ""
    });

    useEffect(() => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const endpointPrincipal = formType === 'transito' 
            ? `${baseURL}/api/animals/public/transito`
            : `${baseURL}/api/animals/public/adopcion`;
        
        const endpointAlternativo = formType === 'transito' 
            ? `${baseURL}/api/animals/public/transito/list`
            : `${baseURL}/api/animals/public/adopcion/list`;
        
        const procesarAnimales = (responseData) => {
            if (responseData && Array.isArray(responseData)) {
                const animalesFiltrados = responseData
                    .filter(animal => 
                        animal.estadoGeneral === true && 
                        animal.tipoIngreso === formType
                    )
                    .map(animal => ({
                        nombre: animal.nombre,
                        id: animal._id,
                        tipoIngreso: animal.tipoIngreso
                    }));
                setListaAnimales(animalesFiltrados);
            } else {
                setListaAnimales([]);
            }
            setLoadingAnimales(false);
        };
        
        axios.get(endpointPrincipal)
            .then(res => {
                procesarAnimales(res.data);
            })
            .catch(() => {
                axios.get(endpointAlternativo)
                    .then(resAlt => {
                        procesarAnimales(resAlt.data);
                    })
                    .catch(() => {
                        setLoadingAnimales(false);
                        setListaAnimales([]);
                    });
            });
    }, [formType]);

    const updateState = (e) => {
        setData({ 
            ...data, 
            [e.target.name]: e.target.value 
        });
        
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: null
            }));
        }
    };

    const filteredList = listaAnimales.filter(animal =>
        animal.nombre.toLowerCase().includes(data.adoptarA.toLowerCase())
    );

    const validateStep = () => {
        const newErrors = {};
        
        if (currentStep === 1) {
            if (!data.nombre.trim()) newErrors.nombre = "El nombre es requerido";
            if (!data.apellido.trim()) newErrors.apellido = "El apellido es requerido";
            if (!data.edad || data.edad < 18 || data.edad > 100) newErrors.edad = "Debes ser mayor de 18 años";
            if (!data.zona.trim()) newErrors.zona = "La zona es requerida";
            if (!data.direccion.trim()) newErrors.direccion = "La dirección es requerida";
            if (!data.telefono.trim() || data.telefono.length < 8) newErrors.telefono = "El teléfono es requerido";
            if (!data.mail.trim() || !data.mail.includes("@")) newErrors.mail = "Email inválido";
        }
        
        if (currentStep === 2) {
            if (!data.adoptarA.trim()) newErrors.adoptarA = "Selecciona un animal";
            if (!data.animalId) newErrors.adoptarA = "Debes seleccionar un animal de la lista";
            if (!data.adoptarOtro.trim() && formType === 'adopcion') newErrors.adoptarOtro = "Responde esta pregunta";
            
            if (!data.motivoAdopcion.trim()) {
                newErrors.motivoAdopcion = "Cuéntanos por qué quieres adoptar";
            } else if (data.motivoAdopcion.trim().length < 10) {
                newErrors.motivoAdopcion = "El motivo debe tener al menos 10 caracteres";
            }
        }
        
        if (currentStep === 3) {
            if (!data.convivientes.trim()) newErrors.convivientes = "Este campo es requerido";
            if (!data.experienciaConAnimales.trim()) newErrors.experienciaConAnimales = "Indica tu experiencia con animales";
            if (!data.otrasMascotas.trim()) newErrors.otrasMascotas = "Este campo es requerido";
        }
        
        if (currentStep === 4) {
            if (!data.horasFueraDeCasa || data.horasFueraDeCasa < 0 || data.horasFueraDeCasa > 24) newErrors.horasFueraDeCasa = "Horas inválidas";
            if (!data.paseos.trim()) newErrors.paseos = "Este campo es requerido";
            if (!data.vacaciones.trim()) newErrors.vacaciones = "Este campo es requerido";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const sendData = async (e) => {
        e.preventDefault();
        
        let allValid = true;
        for (let step = 1; step <= totalSteps; step++) {
            setCurrentStep(step);
            if (!validateStep()) {
                allValid = false;
                break;
            }
        }
        
        if (!allValid) {
            alert("Por favor, completa todos los campos requeridos marcados con *");
            return;
        }
        
        const token1 = localStorage.getItem("token_user");
        const token2 = localStorage.getItem("token");
        const token3 = document.cookie.split('; ').find(row => row.startsWith('token_user='))?.split('=')[1];
        
        const token = token1 || token2 || token3;
        
        if (!token) {
            alert("Debes iniciar sesión para enviar el formulario.");
            navigate("/login");
            return;
        }
        
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem("token_user");
                alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                navigate("/login");
                return;
            }
        } catch {
            localStorage.removeItem("token_user");
            alert("Token inválido. Por favor, inicia sesión nuevamente.");
            navigate("/login");
            return;
        }
        
        if (!data.animalId || data.animalId.length !== 24) {
            alert("Por favor, selecciona un animal válido de la lista");
            setCurrentStep(2);
            return;
        }
        
        setIsSubmitting(true);
        
        const datosParaEnviar = {
            nombre: data.nombre.trim(),
            apellido: data.apellido.trim(),
            edad: parseInt(data.edad),
            zona: data.zona.trim(),
            direccion: data.direccion.trim(),
            telefono: data.telefono.trim(),
            convivientes: data.convivientes.trim(),
            experienciaConAnimales: data.experienciaConAnimales.trim(),
            motivoAdopcion: data.motivoAdopcion.trim(),
            viviendaTipo: data.viviendaTipo,
            tienePatio: data.tienePatio,
            otrasMascotas: data.otrasMascotas.trim(),
            aptoEconomicamente: data.aptoEconomicamente,
            horasFueraDeCasa: parseInt(data.horasFueraDeCasa) || 8,
            mail: data.mail.trim()
        };
        
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const URL = formType === 'transito' 
            ? `${baseURL}/api/solicitudes/transito/${data.animalId}`
            : `${baseURL}/api/solicitudes/adopcion/${data.animalId}`;
        
        const config = {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'token_user': token,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        };
        
        try {
            const response = await axios.post(URL, datosParaEnviar, config);
            
            if (response.data.success === false) {
                throw new Error(response.data.message || "Error del servidor");
            }
            
            alert(`✅ ${formType === 'transito' 
                ? 'Solicitud de tránsito enviada exitosamente!' 
                : 'Formulario de adopción enviado exitosamente!'}`);
            
            setData({
                nombre: "", apellido: "", edad: "", zona: "", direccion: "", telefono: "",
                mail: "", profesion: "", adoptarA: "", animalId: "", adoptarOtro: "",
                motivoAdopcion: "", convivientes: "", experienciaConAnimales: "", viviendaTipo: "casa",
                tienePatio: "si", otrasMascotas: "", aptoEconomicamente: "si",
                horasFueraDeCasa: 8, soloHoras: "", interiorExterior: "", alquiler: "",
                paseos: "", vacaciones: "", gastosMascota: "", acuerdoCastracion: "",
                compromiso: ""
            });
            
            setCurrentStep(1);
            
            setTimeout(() => {
                navigate("/actividades");
            }, 2000);
            
        } catch (error) {
            if (error.response) {
                const responseData = error.response.data;
                
                if (error.response.status === 401) {
                    localStorage.removeItem("token_user");
                    alert("Tu sesión ha expirado o el token no es válido. Por favor, inicia sesión nuevamente.");
                    navigate("/login");
                    
                } else if (error.response.status === 400) {
                    if (responseData.errors) {
                        const errorMessages = Object.entries(responseData.errors)
                            .map(([campo, mensaje]) => `• ${campo}: ${mensaje}`)
                            .join('\n');
                        
                        alert(`❌ Errores de validación:\n${errorMessages}`);
                        
                        const camposConError = Object.keys(responseData.errors);
                        if (camposConError.some(campo => ['nombre', 'apellido', 'edad', 'zona', 'direccion', 'telefono'].includes(campo))) {
                            setCurrentStep(1);
                        } else if (camposConError.some(campo => ['motivoAdopcion'].includes(campo))) {
                            setCurrentStep(2);
                        } else if (camposConError.some(campo => ['convivientes', 'experienciaConAnimales', 'otrasMascotas', 'viviendaTipo', 'tienePatio'].includes(campo))) {
                            setCurrentStep(3);
                        } else if (camposConError.some(campo => ['horasFueraDeCasa', 'aptoEconomicamente'].includes(campo))) {
                            setCurrentStep(4);
                        }
                        
                    } else if (responseData.message) {
                        alert(`❌ ${responseData.message}`);
                    } else {
                        alert("❌ Error: Datos inválidos enviados al servidor");
                    }
                    
                } else if (error.response.status === 403) {
                    alert("❌ No tienes permisos para realizar esta acción.");
                } else if (error.response.status === 404) {
                    alert("❌ Animal no encontrado. Por favor, selecciona otro animal.");
                    setCurrentStep(2);
                } else if (error.response.status === 409) {
                    alert("❌ Ya existe una solicitud para este animal.");
                } else {
                    alert(`❌ Error ${error.response.status}: ${responseData.message || error.response.statusText}`);
                }
                
            } else if (error.request) {
                alert("❌ No se pudo conectar con el servidor. Verifica tu conexión a internet.");
            } else {
                alert(`❌ Error: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectAnimal = (animal) => {
        setData({ 
            ...data, 
            adoptarA: animal.nombre,
            animalId: animal.id
        });
        setShowList(false);
    };

    const renderStep1 = () => (
        <div className={styles.subform}>
            <h4 className="title_orange mb-3">Información Personal</h4>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                name="nombre" 
                                value={data.nombre} 
                                onChange={updateState} 
                                className={errors.nombre ? styles.errorInput : ""}
                                placeholder="Tu nombre"
                            />
                            <label>Nombre *</label>
                            {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                name="apellido" 
                                value={data.apellido} 
                                onChange={updateState} 
                                className={errors.apellido ? styles.errorInput : ""}
                                placeholder="Tu apellido"
                            />
                            <label>Apellido *</label>
                            {errors.apellido && <span className={styles.errorText}>{errors.apellido}</span>}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="number" 
                                name="edad" 
                                value={data.edad} 
                                onChange={updateState} 
                                min="18"
                                max="100"
                                className={errors.edad ? styles.errorInput : ""}
                                placeholder="Tu edad"
                            />
                            <label>Edad *</label>
                            {errors.edad && <span className={styles.errorText}>{errors.edad}</span>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="tel" 
                                name="telefono" 
                                value={data.telefono} 
                                onChange={updateState} 
                                placeholder="11 2345-6789"
                                className={errors.telefono ? styles.errorInput : ""}
                            />
                            <label>Teléfono *</label>
                            {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="d-flex flex-column mb-3">
                <div className={styles.inputGroup}>
                    <input 
                        type="email" 
                        name="mail" 
                        value={data.mail} 
                        onChange={updateState} 
                        placeholder="ejemplo@email.com"
                        className={errors.mail ? styles.errorInput : ""}
                    />
                    <label>Email *</label>
                    {errors.mail && <span className={styles.errorText}>{errors.mail}</span>}
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                name="zona" 
                                value={data.zona} 
                                onChange={updateState} 
                                placeholder="Ej: Garín, Pilar, etc."
                                className={errors.zona ? styles.errorInput : ""}
                            />
                            <label>Zona / Localidad *</label>
                            {errors.zona && <span className={styles.errorText}>{errors.zona}</span>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-3">
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                name="direccion" 
                                value={data.direccion} 
                                onChange={updateState} 
                                placeholder="Calle, número"
                                className={errors.direccion ? styles.errorInput : ""}
                            />
                            <label>Dirección *</label>
                            {errors.direccion && <span className={styles.errorText}>{errors.direccion}</span>}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="d-flex flex-column mb-3">
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        name="profesion"
                        value={data.profesion}
                        onChange={updateState}
                        placeholder="Tu profesión o situación laboral"
                        className={errors.profesion ? styles.errorInput : ""}
                    />
                    <label>Profesión / Situación Laboral</label>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => {
        const titulo = formType === 'transito' 
            ? "¿A cuál de nuestros rescatados querés dar tránsito? *" 
            : "¿A cuál de nuestros rescatados querés adoptar? *";
            
        const placeholderBuscar = formType === 'transito'
            ? "Buscar animal para tránsito por nombre..."
            : "Buscar animal para adopción por nombre...";
            
        const placeholderMotivo = formType === 'transito'
            ? "Cuéntanos tu motivación para dar tránsito..."
            : "Cuéntanos tu motivación para adoptar...";
        
        return (
            <div className={styles.section}>
                <h4 className="title_orange mb-3">
                    {formType === 'transito' ? 'Sobre el Tránsito' : 'Sobre la Adopción'}
                </h4>
                
                <div className="position-relative mb-4">
                    <label className="title_orange mx-2 mb-1">{titulo}</label>
                    
                    <input
                        type="text"
                        name="adoptarA"
                        value={data.adoptarA}
                        onChange={(e) => {
                            updateState(e);
                            setShowList(true);
                        }}
                        onFocus={() => setShowList(true)}
                        onBlur={() => setTimeout(() => setShowList(false), 200)}
                        placeholder={placeholderBuscar}
                        className={`${styles.input} ${errors.adoptarA ? styles.errorInput : ""}`}
                        autoComplete="off"
                    />
                    
                    {data.animalId && (
                        <div className="mt-2">
                            <small className="text-success">
                                ✅ Seleccionado: {data.adoptarA}
                            </small>
                        </div>
                    )}
                    
                    {showList && data.adoptarA.length > 0 && !loadingAnimales && (
                        <div className={styles.autocompleteList}>
                            {filteredList.length > 0 ? (
                                filteredList.map((animal) => (
                                    <div
                                        key={animal.id}
                                        onClick={() => selectAnimal(animal)}
                                        className={styles.autocompleteItem}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <strong>{animal.nombre}</strong>
                                        <small className="text-muted ms-2">
                                            ({animal.tipoIngreso === 'adopcion' ? 'Adopción' : 'Tránsito'})
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-center">
                                    No se encontraron animales para {formType === 'transito' ? 'tránsito' : 'adopción'}
                                </div>
                            )}
                        </div>
                    )}
                    {errors.adoptarA && <span className={styles.errorText}>{errors.adoptarA}</span>}
                    
                    {loadingAnimales && (
                        <div className="mt-2">
                            <small className="text-muted">Cargando animales...</small>
                        </div>
                    )}
                </div>
                
                {formType === 'adopcion' && (
                    <div className="d-flex flex-column mb-4">
                        <label className="title_orange mx-2 mt-3 mb-1">
                            Si ya no está disponible, ¿te interesaría adoptar a otro? *
                        </label>
                        <input
                            type="text"
                            name="adoptarOtro"
                            value={data.adoptarOtro}
                            onChange={updateState}
                            placeholder="Explica si estarías abierto a adoptar otro animal..."
                            className={`${styles.input} ${errors.adoptarOtro ? styles.errorInput : ""}`}
                        />
                        {errors.adoptarOtro && <span className={styles.errorText}>{errors.adoptarOtro}</span>}
                    </div>
                )}
                
                <div className="d-flex flex-column mb-4">
                    <label className="title_orange mx-2 mt-3 mb-1">
                        ¿Por qué querés {formType === 'transito' ? 'dar tránsito' : 'adoptar'}? *
                    </label>
                    <textarea 
                        name="motivoAdopcion"
                        value={data.motivoAdopcion}
                        onChange={updateState} 
                        placeholder={placeholderMotivo}
                        rows={3}
                        className={`${styles.textarea} ${errors.motivoAdopcion ? styles.errorInput : ""}`}
                    ></textarea>
                    {errors.motivoAdopcion && <span className={styles.errorText}>{errors.motivoAdopcion}</span>}
                </div>
            </div>
        );
    };

    const renderStep3 = () => (
        <div className={styles.section}>
            <h4 className="title_orange mb-3">Hogar y Experiencia</h4>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-1 mb-1">¿Con quién vivís? *</label>
                <textarea 
                    name="convivientes" 
                    value={data.convivientes} 
                    onChange={updateState} 
                    placeholder="Ej: Vivo con mi pareja y dos hijos de 8 y 10 años"
                    rows={2}
                    className={`${styles.textarea} ${errors.convivientes ? styles.errorInput : ""}`}
                ></textarea>
                {errors.convivientes && <span className={styles.errorText}>{errors.convivientes}</span>}
            </div>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-1 mb-1">¿Tenés experiencia con animales? *</label>
                <textarea 
                    name="experienciaConAnimales" 
                    value={data.experienciaConAnimales} 
                    onChange={updateState} 
                    placeholder="Cuéntanos sobre tu experiencia con animales..."
                    rows={2}
                    className={`${styles.textarea} ${errors.experienciaConAnimales ? styles.errorInput : ""}`}
                ></textarea>
                {errors.experienciaConAnimales && <span className={styles.errorText}>{errors.experienciaConAnimales}</span>}
            </div>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-1 mb-1">¿Tenés otras mascotas? *</label>
                <textarea 
                    name="otrasMascotas" 
                    value={data.otrasMascotas} 
                    onChange={updateState} 
                    placeholder="Cuéntanos sobre tus mascotas actuales..."
                    rows={2}
                    className={`${styles.textarea} ${errors.otrasMascotas ? styles.errorInput : ""}`}
                ></textarea>
                {errors.otrasMascotas && <span className={styles.errorText}>{errors.otrasMascotas}</span>}
            </div>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-4">
                        <label className="title_orange mx-2 mt-1 mb-1">Tipo de vivienda *</label>
                        <select 
                            name="viviendaTipo" 
                            value={data.viviendaTipo} 
                            onChange={updateState}
                            className="form-select"
                        >
                            <option value="casa">Casa</option>
                            <option value="departamento">Departamento</option>
                            <option value="quinta">Quinta</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column mb-4">
                        <label className="title_orange mx-2 mt-1 mb-1">¿Tenés patio? *</label>
                        <select 
                            name="tienePatio" 
                            value={data.tienePatio} 
                            onChange={updateState}
                            className="form-select"
                        >
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className={styles.section}>
            <h4 className="title_orange mb-3">Cuidados y Responsabilidad</h4>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-2 mb-1">
                    ¿Cuántas horas al día estaría solo el animal? *
                </label>
                <input
                    type="number"
                    name="horasFueraDeCasa"
                    value={data.horasFueraDeCasa}
                    onChange={updateState}
                    min="0"
                    max="24"
                    placeholder="Ej: 8 horas"
                    className={`form-control ${errors.horasFueraDeCasa ? styles.errorInput : ""}`}
                />
                {errors.horasFueraDeCasa && <span className={styles.errorText}>{errors.horasFueraDeCasa}</span>}
            </div>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-2 mb-1">
                    ¿Cómo serían los paseos diarios? (frecuencia, duración) *
                </label>
                <textarea
                    name="paseos"
                    value={data.paseos}
                    onChange={updateState}
                    placeholder="Describe tu rutina de paseos..."
                    rows={2}
                    className={`${styles.textarea} ${errors.paseos ? styles.errorInput : ""}`}
                ></textarea>
                {errors.paseos && <span className={styles.errorText}>{errors.paseos}</span>}
            </div>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-3 mb-1">
                    ¿Qué harías con el animal si te vas de vacaciones? *
                </label>
                <textarea
                    name="vacaciones"
                    value={data.vacaciones}
                    onChange={updateState}
                    placeholder="¿Tienes alguien que lo cuide? ¿Lo llevarías contigo?..."
                    rows={2}
                    className={`${styles.textarea} ${errors.vacaciones ? styles.errorInput : ""}`}
                ></textarea>
                {errors.vacaciones && <span className={styles.errorText}>{errors.vacaciones}</span>}
            </div>
            
            <div className="d-flex flex-column mb-4">
                <label className="title_orange mx-2 mt-3 mb-1">
                    ¿Podés cubrir los gastos del animal? *
                </label>
                <select 
                    name="aptoEconomicamente" 
                    value={data.aptoEconomicamente} 
                    onChange={updateState}
                    className="form-select"
                >
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className={styles.section}>
            <h4 className="title_orange mb-3">Confirmación Final</h4>
            
            <div className="d-flex flex-column mb-4 mt-3">
                <label className="title_orange mx-2 mt-1 mb-1">
                    Confirmación de compromiso (opcional)
                </label>
                <textarea 
                    name="compromiso" 
                    value={data.compromiso} 
                    onChange={updateState}
                    placeholder="Puedes confirmar tu compromiso de cuidar responsablemente al animal (opcional)..."
                    rows={3}
                    className={`${styles.textarea} ${errors.compromiso ? styles.errorInput : ""}`}
                ></textarea>
                {errors.compromiso && <span className={styles.errorText}>{errors.compromiso}</span>}
            </div>
            
            <div className="alert alert-info mt-4">
                <h5 className="alert-heading">📝 Importante</h5>
                <p className="mb-0">
                    Al enviar este formulario, aceptas que:
                    <ul>
                        <li>Toda la información proporcionada es verídica</li>
                        <li>Te comprometes a brindar un hogar responsable</li>
                        <li>La fundación realizará un seguimiento del proceso</li>
                        <li>Podrán contactarte para coordinar una entrevista</li>
                    </ul>
                </p>
            </div>
        </div>
    );

    const titulo = formType === 'transito' 
        ? "Formulario de Tránsito" 
        : "Formulario de Adopción";
        
    const descripcion = formType === 'transito'
        ? "Completa este formulario para postularte como hogar de tránsito. Todos los campos con * son obligatorios."
        : "Completa este formulario para postularte como adoptante. Todos los campos con * son obligatorios.";

    const textoBotonEnviar = formType === 'transito' 
        ? (isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Tránsito') 
        : (isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Adopción');

    return (
        <div className={styles.wrapper}>
            <h2 className="title_orange mb-4">{titulo}</h2>
            <p className="text-center mb-4">{descripcion}</p>
            
            <div className={styles.cardForm}>
                <form onSubmit={sendData} className={styles.formContainer}>
                    <div className={styles.progress_container}>
                        <div
                            className={styles.progress}
                            style={{ transform: `translateY(-50%) scaleX(${progressPercent})` }}
                        ></div>
                        
                        <ol>
                            <li className={currentStep === 1 ? styles.current : (currentStep > 1 ? styles.done : "")}>
                                <span>1</span>
                                <small>Personal</small>
                            </li>
                            <li className={currentStep === 2 ? styles.current : (currentStep > 2 ? styles.done : "")}>
                                <span>2</span>
                                <small>{formType === 'transito' ? 'Tránsito' : 'Adopción'}</small>
                            </li>
                            <li className={currentStep === 3 ? styles.current : (currentStep > 3 ? styles.done : "")}>
                                <span>3</span>
                                <small>Hogar</small>
                            </li>
                            <li className={currentStep === 4 ? styles.current : (currentStep > 4 ? styles.done : "")}>
                                <span>4</span>
                                <small>Cuidados</small>
                            </li>
                            <li className={currentStep === 5 ? styles.current : (currentStep > 5 ? styles.done : "")}>
                                <span>5</span>
                                <small>Compromiso</small>
                            </li>
                        </ol>
                    </div>
                    
                    <div className={styles.formContent}>
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                        {currentStep === 5 && renderStep5()}
                        
                        {Object.keys(errors).length > 0 && (
                            <div className="alert alert-danger mt-3">
                                <strong>Errores en este paso:</strong>
                                <ul className="mb-0">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between mt-4 px-3">
                        <div>
                            {currentStep > 1 && (
                                <button 
                                    type="button" 
                                    onClick={handlePrevious}
                                    className="px-4 py-2 rounded btn btn-outline-orange"
                                    disabled={isSubmitting}
                                >
                                    ← Anterior
                                </button>
                            )}
                        </div>
                        
                        <div className="d-flex align-items-center">
                            <span className="me-3 text-muted">
                                Paso {currentStep} de {totalSteps}
                            </span>
                            
                            {currentStep === totalSteps ? (
                                <button 
                                    type="submit" 
                                    className={`px-4 py-2 rounded btn ${formType === 'transito' ? 'btn-warning' : 'btn-success'}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    )}
                                    {textoBotonEnviar}
                                </button>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="px-4 py-2 rounded btn btn-orange"
                                    disabled={isSubmitting}
                                >
                                    Siguiente →
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;