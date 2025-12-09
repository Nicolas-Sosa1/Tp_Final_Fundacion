import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../css/user/Form.module.css";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const FormTransit = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const progressPercent = (currentStep - 1) / (totalSteps - 1);

  const [listaAnimales, setListaAnimales] = useState([]);
  const [showList, setShowList] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingAnimales, setLoadingAnimales] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const [data, setData] = useState({
    // Información personal
    nombre: "",
    apellido: "",
    edad: "",
    zona: "",
    direccion: "",
    telefono: "",
    mail: "",

    // Sobre el tránsito
    adoptarA: "",
    animalId: "",
    motivo: "",

    // Campos específicos del modelo SolicitudTransito
    tiempoDisponible: "",
    experienciaConAnimales: "",
    cuidadosEspecialesPosibles: "",
    cubrirGastos: "si",
    espacioEnCasa: "mediano",
    otrasMascotas: "",

    // Campos adicionales
    horariosDisponibles: "",
    experienciaEspecifica: "",
    contactoEmergencia: "",
    referencias: "",
    compromiso: "",
  });

  // Cargar lista de animales para tránsito
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const endpoint = `${baseURL}/api/animals/public/transito/list`;

    console.log("🌐 Cargando animales para tránsito desde:", endpoint);

    axios
      .get(endpoint)
      .then((res) => {
        console.log("✅ Animales para tránsito cargados:", res.data);
        if (res.data && Array.isArray(res.data)) {
          setListaAnimales(
            res.data.map((animal) => ({
              nombre: animal.nombre,
              id: animal._id,
              tipoIngreso: animal.tipoIngreso,
            }))
          );
        }
        setLoadingAnimales(false);
      })
      .catch((err) => {
        console.log("❌ Error cargando animales para tránsito:", err);
        setLoadingAnimales(false);
        setListaAnimales([]);
      });
  }, []);

  const updateState = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: null,
      }));
    }
  };

  const filteredList = listaAnimales.filter((animal) =>
    animal.nombre.toLowerCase().includes(data.adoptarA.toLowerCase())
  );

  const validateStep = () => {
    console.log(`Validando paso ${currentStep}...`);
    const newErrors = {};

    if (currentStep === 1) {
      if (!data.nombre.trim()) newErrors.nombre = "El nombre es requerido";
      if (!data.apellido.trim())
        newErrors.apellido = "El apellido es requerido";
      if (!data.edad || data.edad < 18 || data.edad > 100)
        newErrors.edad = "Debes ser mayor de 18 años";
      if (!data.zona.trim()) newErrors.zona = "La zona es requerida";
      if (!data.direccion.trim())
        newErrors.direccion = "La dirección es requerida";
      if (!data.telefono.trim() || data.telefono.length < 8)
        newErrors.telefono = "El teléfono es requerido";
      if (!data.mail.trim() || !data.mail.includes("@"))
        newErrors.mail = "Email inválido";
    }

    if (currentStep === 2) {
      if (!data.adoptarA.trim()) newErrors.adoptarA = "Selecciona un animal";
      if (!data.animalId)
        newErrors.adoptarA = "Debes seleccionar un animal de la lista";

      // VALIDACIÓN ESPECÍFICA PARA motivo
      if (!data.motivo.trim()) {
        newErrors.motivo = "Cuéntanos por qué quieres dar tránsito";
      } else if (data.motivo.trim().length < 5) {
        newErrors.motivo = "Explica con más detalle (mínimo 5 caracteres)";
      }
    }

    if (currentStep === 3) {
      if (!data.tiempoDisponible.trim())
        newErrors.tiempoDisponible =
          "Indica cuánto tiempo podés tener al animal";
      if (!data.experienciaConAnimales.trim())
        newErrors.experienciaConAnimales = "Indica tu experiencia con animales";
      if (!data.cuidadosEspecialesPosibles.trim())
        newErrors.cuidadosEspecialesPosibles =
          "Indica si podés realizar cuidados especiales";
      if (!data.otrasMascotas.trim())
        newErrors.otrasMascotas = "Indica si tenés otras mascotas";
    }

    if (currentStep === 4) {
      if (!data.horariosDisponibles.trim())
        newErrors.horariosDisponibles = "Indica tus horarios disponibles";
      if (!data.experienciaEspecifica.trim())
        newErrors.experienciaEspecifica = "Describí tu experiencia específica";
      if (!data.contactoEmergencia.trim())
        newErrors.contactoEmergencia = "Proporcioná un contacto de emergencia";
    }

    if (currentStep === 5) {
      if (!data.compromiso.trim())
        newErrors.compromiso = "Este campo es requerido";
      if (!data.referencias.trim())
        newErrors.referencias =
          "Podés incluir referencias o comentarios adicionales";
    }

    console.log("Errores encontrados:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log(`Siguiente desde paso ${currentStep}...`);
    if (validateStep()) {
      console.log(`Paso ${currentStep} válido, avanzando...`);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      console.log(`Errores en paso ${currentStep}:`, errors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const selectAnimal = (animal) => {
    setData({
      ...data,
      adoptarA: animal.nombre,
      animalId: animal.id,
    });
    setShowList(false);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setGeneralError("");

    console.log("🔍 Iniciando envío del formulario de tránsito...");

    // Validar todos los pasos antes de enviar
    let allValid = true;
    const tempErrors = {};

    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = {};

      if (step === 1) {
        if (!data.nombre.trim()) stepErrors.nombre = "El nombre es requerido";
        if (!data.apellido.trim())
          stepErrors.apellido = "El apellido es requerido";
        if (!data.edad || data.edad < 18 || data.edad > 100)
          stepErrors.edad = "Debes ser mayor de 18 años";
        if (!data.zona.trim()) stepErrors.zona = "La zona es requerida";
        if (!data.direccion.trim())
          stepErrors.direccion = "La dirección es requerida";
        if (!data.telefono.trim() || data.telefono.length < 8)
          stepErrors.telefono = "El teléfono es requerido";
        if (!data.mail.trim() || !data.mail.includes("@"))
          stepErrors.mail = "Email inválido";
      }

      if (step === 2) {
        if (!data.adoptarA.trim()) stepErrors.adoptarA = "Selecciona un animal";
        if (!data.animalId)
          stepErrors.adoptarA = "Debes seleccionar un animal de la lista";
        if (!data.motivo.trim() || data.motivo.trim().length < 5)
          stepErrors.motivo = "Explica tu motivación (mínimo 5 caracteres)";
      }

      if (step === 3) {
        if (!data.tiempoDisponible.trim())
          stepErrors.tiempoDisponible =
            "Indica cuánto tiempo podés tener al animal";
        if (!data.experienciaConAnimales.trim())
          stepErrors.experienciaConAnimales =
            "Indica tu experiencia con animales";
        if (!data.cuidadosEspecialesPosibles.trim())
          stepErrors.cuidadosEspecialesPosibles =
            "Indica si podés realizar cuidados especiales";
        if (!data.otrasMascotas.trim())
          stepErrors.otrasMascotas = "Indica si tenés otras mascotas";
      }

      if (step === 4) {
        if (!data.horariosDisponibles.trim())
          stepErrors.horariosDisponibles = "Indica tus horarios disponibles";
        if (!data.experienciaEspecifica.trim())
          stepErrors.experienciaEspecifica =
            "Describí tu experiencia específica";
        if (!data.contactoEmergencia.trim())
          stepErrors.contactoEmergencia =
            "Proporcioná un contacto de emergencia";
      }

      if (step === 5) {
        if (!data.compromiso.trim())
          stepErrors.compromiso = "Confirma tu compromiso";
        if (!data.referencias.trim())
          stepErrors.referencias = "Incluye referencias o comentarios";
      }

      if (Object.keys(stepErrors).length > 0) {
        Object.assign(tempErrors, stepErrors);
        allValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (!allValid) {
      setErrors(tempErrors);
      alert("Por favor, completa todos los campos requeridos marcados con *");
      return;
    }

    // OBTENER TOKEN
    const token1 = localStorage.getItem("token_user");
    const token2 = localStorage.getItem("token");
    const token3 = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token_user="))
      ?.split("=")[1];

    const token = token1 || token2 || token3;

    if (!token) {
      alert("Debes iniciar sesión para enviar el formulario.");
      navigate("/login");
      return;
    }

    // VERIFICAR TOKEN
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("token_user");
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        navigate("/login");
        return;
      }
    } catch (decodeError) {
      localStorage.removeItem("token_user");
      alert("Token inválido. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    // VALIDAR ANIMAL
    if (!data.animalId || data.animalId.length !== 24) {
      alert("Por favor, selecciona un animal válido de la lista");
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    // PREPARAR DATOS COMPLETOS según lo que espera el backend
    const datosParaEnviar = {
      // Información personal del solicitante
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      edad: parseInt(data.edad),
      zona: data.zona.trim(),
      direccion: data.direccion.trim(),
      telefono: data.telefono.trim(),
      email: data.mail.trim(),

      // Información sobre el animal
      animalNombre: data.adoptarA.trim(),
      animalId: data.animalId,

      // Motivación y detalles del tránsito
      motivo: data.motivo.trim(),
      tiempoDisponible: data.tiempoDisponible.trim(),
      experienciaConAnimales: data.experienciaConAnimales.trim(),
      cuidadosEspecialesPosibles: data.cuidadosEspecialesPosibles.trim(),
      cubrirGastos: data.cubrirGastos,
      espacioEnCasa: data.espacioEnCasa,
      otrasMascotas: data.otrasMascotas.trim(),

      // Información adicional
      horariosDisponibles: data.horariosDisponibles.trim(),
      experienciaEspecifica: data.experienciaEspecifica.trim(),
      contactoEmergencia: data.contactoEmergencia.trim(),
      referencias: data.referencias.trim(),
      compromiso: data.compromiso.trim(),

      // Campos que podrían ser requeridos por el backend
      estado: "pendiente", // Estado inicial de la solicitud
      fechaSolicitud: new Date().toISOString(),
    };

    console.log("📦 Datos preparados para enviar:", datosParaEnviar);

    // CONFIGURAR URL Y HEADERS
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const URL = `${baseURL}/api/solicitudes/transito`;

    console.log("🌐 URL de envío:", URL);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      console.log("📤 Enviando solicitud de tránsito...");
      const response = await axios.post(URL, datosParaEnviar, config);

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data.success === false) {
        throw new Error(response.data.message || "Error del servidor");
      }

      alert("✅ Solicitud de tránsito enviada exitosamente!");

      // Limpiar formulario
      setData({
        nombre: "",
        apellido: "",
        edad: "",
        zona: "",
        direccion: "",
        telefono: "",
        mail: "",
        adoptarA: "",
        animalId: "",
        motivo: "",
        tiempoDisponible: "",
        experienciaConAnimales: "",
        cuidadosEspecialesPosibles: "",
        cubrirGastos: "si",
        espacioEnCasa: "mediano",
        otrasMascotas: "",
        horariosDisponibles: "",
        experienciaEspecifica: "",
        contactoEmergencia: "",
        referencias: "",
        compromiso: "",
      });

      setCurrentStep(1);
      setErrors({});

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/actividades");
      }, 2000);
    } catch (error) {
      console.error("❌ ERROR al enviar formulario de tránsito:", error);

      if (error.response) {
        const responseData = error.response.data;
        console.log("📋 Detalles del error:", responseData);

        if (error.response.status === 400) {
          if (responseData.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([campo, mensaje]) => `• ${campo}: ${mensaje}`)
              .join("\n");

            setGeneralError(`Errores de validación:\n${errorMessages}`);
          } else if (responseData.message) {
            setGeneralError(responseData.message);
          } else {
            setGeneralError("Error de validación en el formulario");
          }
        } else if (error.response.status === 401) {
          localStorage.removeItem("token_user");
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          navigate("/login");
        } else if (error.response.status === 404) {
          setGeneralError(
            "Animal no encontrado. Por favor, selecciona otro animal."
          );
          setCurrentStep(2);
        } else if (error.response.status === 409) {
          setGeneralError("Ya has enviado una solicitud para este animal");
        } else if (error.response.status === 500) {
          setGeneralError(
            "Error interno del servidor. Por favor, intenta más tarde."
          );
        } else {
          setGeneralError(
            `Error ${error.response.status}: ${
              responseData.message || "Error desconocido"
            }`
          );
        }
      } else if (error.request) {
        setGeneralError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
      } else {
        setGeneralError(`Error: ${error.message}`);
      }

      // Mostrar error general
      if (generalError) {
        alert(generalError);
      }
    } finally {
      setIsSubmitting(false);
    }
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
              {errors.nombre && (
                <span className={styles.errorText}>{errors.nombre}</span>
              )}
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
              {errors.apellido && (
                <span className={styles.errorText}>{errors.apellido}</span>
              )}
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
              {errors.edad && (
                <span className={styles.errorText}>{errors.edad}</span>
              )}
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
              {errors.telefono && (
                <span className={styles.errorText}>{errors.telefono}</span>
              )}
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
          {errors.mail && (
            <span className={styles.errorText}>{errors.mail}</span>
          )}
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
              {errors.zona && (
                <span className={styles.errorText}>{errors.zona}</span>
              )}
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
              {errors.direccion && (
                <span className={styles.errorText}>{errors.direccion}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    return (
      <div className={styles.section}>
        <h4 className="title_orange mb-3">Sobre el Tránsito</h4>

        <div className="position-relative mb-4">
          <label className="title_orange mx-2 mb-1">
            ¿A cuál de nuestros rescatados querés dar tránsito? *
          </label>

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
            placeholder="Buscar animal para tránsito por nombre..."
            className={`${styles.input} ${
              errors.adoptarA ? styles.errorInput : ""
            }`}
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
                    <small className="text-muted ms-2">(Tránsito)</small>
                  </div>
                ))
              ) : (
                <div className="p-2 text-center">
                  No se encontraron animales para tránsito
                </div>
              )}
            </div>
          )}
          {errors.adoptarA && (
            <span className={styles.errorText}>{errors.adoptarA}</span>
          )}

          {loadingAnimales && (
            <div className="mt-2">
              <small className="text-muted">Cargando animales...</small>
            </div>
          )}
        </div>

        <div className="d-flex flex-column mb-4">
          <label className="title_orange mx-2 mt-3 mb-1">
            ¿Por qué querés dar tránsito? *
          </label>
          <textarea
            name="motivo"
            value={data.motivo}
            onChange={updateState}
            placeholder="Cuéntanos tu motivación para dar tránsito..."
            rows={3}
            className={`${styles.textarea} ${
              errors.motivo ? styles.errorInput : ""
            }`}
          ></textarea>
          {errors.motivo && (
            <span className={styles.errorText}>{errors.motivo}</span>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className={styles.section}>
      <h4 className="title_orange mb-3">Disponibilidad y Experiencia</h4>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-1 mb-1">
          ¿Cuánto tiempo podés tener al animal? *
        </label>
        <textarea
          name="tiempoDisponible"
          value={data.tiempoDisponible}
          onChange={updateState}
          placeholder="Ej: 2 semanas, 1 mes, hasta que encuentre hogar definitivo..."
          rows={2}
          className={`${styles.textarea} ${
            errors.tiempoDisponible ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.tiempoDisponible && (
          <span className={styles.errorText}>{errors.tiempoDisponible}</span>
        )}
      </div>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-1 mb-1">
          ¿Tenés experiencia con animales? *
        </label>
        <textarea
          name="experienciaConAnimales"
          value={data.experienciaConAnimales}
          onChange={updateState}
          placeholder="Cuéntanos sobre tu experiencia con animales..."
          rows={2}
          className={`${styles.textarea} ${
            errors.experienciaConAnimales ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.experienciaConAnimales && (
          <span className={styles.errorText}>
            {errors.experienciaConAnimales}
          </span>
        )}
      </div>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-1 mb-1">
          ¿Podés realizar cuidados especiales si son necesarios? *
        </label>
        <textarea
          name="cuidadosEspecialesPosibles"
          value={data.cuidadosEspecialesPosibles}
          onChange={updateState}
          placeholder="Ej: administración de medicamentos, cuidados post-operatorios..."
          rows={2}
          className={`${styles.textarea} ${
            errors.cuidadosEspecialesPosibles ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.cuidadosEspecialesPosibles && (
          <span className={styles.errorText}>
            {errors.cuidadosEspecialesPosibles}
          </span>
        )}
      </div>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-1 mb-1">
          ¿Tenés otras mascotas? *
        </label>
        <textarea
          name="otrasMascotas"
          value={data.otrasMascotas}
          onChange={updateState}
          placeholder="Cuéntanos sobre tus mascotas actuales..."
          rows={2}
          className={`${styles.textarea} ${
            errors.otrasMascotas ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.otrasMascotas && (
          <span className={styles.errorText}>{errors.otrasMascotas}</span>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex flex-column mb-4">
            <label className="title_orange mx-2 mt-1 mb-1">
              ¿Podés cubrir gastos básicos? *
            </label>
            <select
              name="cubrirGastos"
              value={data.cubrirGastos}
              onChange={updateState}
              className="form-select"
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column mb-4">
            <label className="title_orange mx-2 mt-1 mb-1">
              Espacio disponible en tu vivienda *
            </label>
            <select
              name="espacioEnCasa"
              value={data.espacioEnCasa}
              onChange={updateState}
              className="form-select"
            >
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.section}>
      <h4 className="title_orange mb-3">Horarios y Contacto</h4>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-2 mb-1">
          ¿Cuáles son tus horarios disponibles? *
        </label>
        <textarea
          name="horariosDisponibles"
          value={data.horariosDisponibles}
          onChange={updateState}
          placeholder="Describe tus horarios de trabajo, estudio, etc..."
          rows={2}
          className={`${styles.textarea} ${
            errors.horariosDisponibles ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.horariosDisponibles && (
          <span className={styles.errorText}>{errors.horariosDisponibles}</span>
        )}
      </div>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-2 mb-1">
          Experiencia específica con animales rescatados *
        </label>
        <textarea
          name="experienciaEspecifica"
          value={data.experienciaEspecifica}
          onChange={updateState}
          placeholder="¿Has tenido experiencia con animales rescatados anteriormente?"
          rows={2}
          className={`${styles.textarea} ${
            errors.experienciaEspecifica ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.experienciaEspecifica && (
          <span className={styles.errorText}>
            {errors.experienciaEspecifica}
          </span>
        )}
      </div>

      <div className="d-flex flex-column mb-4">
        <label className="title_orange mx-2 mt-3 mb-1">
          Contacto de emergencia *
        </label>
        <textarea
          name="contactoEmergencia"
          value={data.contactoEmergencia}
          onChange={updateState}
          placeholder="Nombre y teléfono de contacto en caso de emergencia..."
          rows={2}
          className={`${styles.textarea} ${
            errors.contactoEmergencia ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.contactoEmergencia && (
          <span className={styles.errorText}>{errors.contactoEmergencia}</span>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className={styles.section}>
      <h4 className="title_orange mb-3">Compromiso Final</h4>

      <div className="d-flex flex-column mb-4 mt-3">
        <label className="title_orange mx-2 mt-1 mb-1">
          Referencias o comentarios adicionales *
        </label>
        <textarea
          name="referencias"
          value={data.referencias}
          onChange={updateState}
          placeholder="Podés incluir referencias veterinarias o cualquier comentario que consideres importante..."
          rows={3}
          className={`${styles.textarea} ${
            errors.referencias ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.referencias && (
          <span className={styles.errorText}>{errors.referencias}</span>
        )}
      </div>

      <div className="d-flex flex-column mb-4 mt-3">
        <label className="title_orange mx-2 mt-1 mb-1">
          Confirma tu compromiso de ser hogar transitorio responsable *
        </label>
        <textarea
          name="compromiso"
          value={data.compromiso}
          onChange={updateState}
          placeholder="Por favor, confirma tu compromiso de cuidar al animal temporalmente de forma responsable..."
          rows={3}
          className={`${styles.textarea} ${
            errors.compromiso ? styles.errorInput : ""
          }`}
        ></textarea>
        {errors.compromiso && (
          <span className={styles.errorText}>{errors.compromiso}</span>
        )}
      </div>

      <div className="alert alert-warning mt-4">
        <h5 className="alert-heading">⚠️ Importante</h5>
        <p className="mb-0">
          Como hogar transitorio, te comprometes a cuidar temporalmente al
          animal hasta que encuentre un hogar definitivo. La fundación
          proporcionará apoyo y seguimiento durante el proceso.
        </p>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <h2 className="title_orange mb-4">Formulario de Tránsito</h2>
      <p className="text-center mb-4">
        Completa este formulario para postularte como hogar de tránsito. Todos
        los campos con * son obligatorios.
      </p>

      {generalError && (
        <div className="alert alert-danger mb-4">
          <strong>Error:</strong> {generalError}
        </div>
      )}

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
              <li
                className={
                  currentStep === 1
                    ? styles.current
                    : currentStep > 1
                    ? styles.done
                    : ""
                }
              >
                <span>1</span>
                <small>Personal</small>
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
                <span>2</span>
                <small>Tránsito</small>
              </li>
              <li
                className={
                  currentStep === 3
                    ? styles.current
                    : currentStep > 3
                    ? styles.done
                    : ""
                }
              >
                <span>3</span>
                <small>Disponibilidad</small>
              </li>
              <li
                className={
                  currentStep === 4
                    ? styles.current
                    : currentStep > 4
                    ? styles.done
                    : ""
                }
              >
                <span>4</span>
                <small>Contacto</small>
              </li>
              <li
                className={
                  currentStep === 5
                    ? styles.current
                    : currentStep > 5
                    ? styles.done
                    : ""
                }
              >
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

            {/* Mostrar errores del paso actual */}
            {Object.keys(errors).length > 0 && (
              <div className="alert alert-danger mt-3">
                <strong>Errores en este paso:</strong>
                <ul className="mb-0">
                  {Object.entries(errors).map(
                    ([field, error]) => error && <li key={field}>{error}</li>
                  )}
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
                  className="px-4 py-2 rounded btn btn-warning"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {isSubmitting
                    ? "Enviando..."
                    : "Enviar Solicitud de Tránsito"}
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

export default FormTransit;
