// file: Animales.jsx (CORREGIDO)
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// URL base del backend
const API_URL = "http://localhost:8000";

// Función helper para obtener URL de imagen segura
const getSafeImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/img/perro.png"; // Imagen por defecto
  }
  
  // Si ya es una URL completa
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Si es base64
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // Si es una ruta relativa que comienza con /
  if (imagePath.startsWith('/')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Si es solo un nombre de archivo o ruta relativa
  return `${API_URL}/uploads/${imagePath}`;
};

const Animales = () => {
  const { id } = useParams();
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("token_user");

  // Estado para vista detallada
  const [detallePerro, setDetallePerro] = useState({
    nombre: "",
    edad: 0,
    sexo: "",
    tamaño: "",
    peso: 0,
    historia: "",
    castrado: false,
    vacunas: [],
    ubicacion: "",
    desparasitado: false,
    discapacidad: "",
    imagen: "",
    tipoIngreso: ""
  });

  // Filtros para la vista de lista
  const [filters, setFilters] = useState({
    tipoIngreso: "todos",
    tamaño: "todos",
    sexo: "todos",
    edad: "todos"
  });

  // Determinar si estamos en vista detalle o lista
  const isDetalleView = !!id;

  // Efecto para cargar datos según la vista
  useEffect(() => {
    if (isDetalleView) {
      fetchDetallePerro();
    } else {
      fetchPerros();
    }
  }, [id, isDetalleView]);

  // Función para cargar detalle de un perro
  const fetchDetallePerro = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token_user");
      const config = token ? { headers: { token_user: token } } : {};
      
      const res = await axios.get(`${API_URL}/api/animals/${id}`, config);
      setDetallePerro(res.data.animal);
      setLoading(false);
    } catch (e) {
      console.log("Error cargando perro:", e);
      
      // Solo redirigir si hay error 401 y el usuario tenía token
      if (e.response?.status === 401 && isAuthenticated) {
        localStorage.removeItem("token_user");
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        setError("Error al cargar los detalles del animal.");
      }
      setLoading(false);
    }
  };

  // Función para cargar lista de perros
  const fetchPerros = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token_user");
      
      // Configurar headers solo si hay token
      const config = token ? { 
        headers: { 
          Authorization: `Bearer ${token}`,
          token_user: token 
        }
      } : {};
      
      console.log("Cargando animales...", token ? "Con token" : "Sin token");
      
      try {
        const response = await axios.get(
          `${API_URL}/api/animals/public/all`, 
          config
        );
        
        console.log("Respuesta de /public/all:", response.data);
        setPerros(response.data);
        setLoading(false);
        
      } catch (endpointError) {
        console.log("Endpoint /public/all no disponible, usando endpoints separados...");
        
        // Si /public/all falla, usar los endpoints individuales
        const [adopcionRes, transitoRes] = await Promise.all([
          axios.get(`${API_URL}/api/animals/public/adopcion`, config),
          axios.get(`${API_URL}/api/animals/public/transito`, config)
        ]);

        // Combinar y filtrar solo los disponibles
        const allDogs = [...adopcionRes.data, ...transitoRes.data];
        const availableDogs = allDogs.filter(dog => dog.estadoGeneral === true);
        
        console.log("Perros obtenidos de endpoints separados:", availableDogs.length);
        setPerros(availableDogs);
        setLoading(false);
      }
      
    } catch (err) {
      console.error("Error completo al cargar los animales:", err);
      
      // Manejo de errores de autenticación
      if (err.response?.status === 401) {
        if (isAuthenticated) {
          // Token inválido o expirado para usuario logueado
          localStorage.removeItem("token_user");
          setError("Tu sesión ha expirado. Los datos se cargarán en modo público.");
          
          // Intentar cargar nuevamente sin token
          setTimeout(() => fetchPerros(), 1000);
        } else {
          // Usuario no logueado - mostrar error genérico
          setError("Error al cargar los animales. Por favor, intenta nuevamente.");
          setLoading(false);
        }
      } else {
        // Otros errores
        setError("Error al cargar los animales. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    }
  };

  // Aplicar filtros a la lista
  const filteredPerros = perros.filter(perro => {
    if (filters.tipoIngreso !== "todos" && perro.tipoIngreso !== filters.tipoIngreso) {
      return false;
    }
    if (filters.tamaño !== "todos" && perro.tamaño !== filters.tamaño) {
      return false;
    }
    if (filters.sexo !== "todos" && perro.sexo !== filters.sexo) {
      return false;
    }
    if (filters.edad !== "todos") {
      const age = parseFloat(perro.edad) || 0;
      if (filters.edad === "cachorro" && age > 2) return false;
      if (filters.edad === "adulto" && (age <= 2 || age > 7)) return false;
      if (filters.edad === "mayor" && age <= 7) return false;
    }
    return true;
  });

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      tipoIngreso: "todos",
      tamaño: "todos",
      sexo: "todos",
      edad: "todos"
    });
  };

  // Navegar a detalles
  const handleVerDetalles = (id) => {
    navigate(`/animales/${id}`);
  };

  // Volver a la lista
  const handleVolverLista = () => {
    navigate("/animales");
  };

  // Manejar acción de adopción/transito
  const handleAccion = (perro) => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      navigate("/login", { 
        state: { 
          from: `/animales/${perro._id}`,
          message: `Para ${perro.tipoIngreso === 'adopcion' ? 'adoptar' : 'ser hogar de tránsito'} a ${perro.nombre}, necesitas iniciar sesión.` 
        } 
      });
      return;
    }
    
    // Aquí iría la lógica para iniciar el proceso de adopción/transito
    console.log(`Iniciando proceso de ${perro.tipoIngreso} para ${perro.nombre}`);
    // navigate(`/adoptar/${perro._id}`); // o similar
  };

  // Loading state
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">
          {isDetalleView ? "Cargando detalles..." : "Cargando animales..."}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
        <button 
          className="btn btn_navbar mt-3"
          onClick={isDetalleView ? fetchDetallePerro : fetchPerros}
        >
          Reintentar
        </button>
        {!isAuthenticated && (
          <button 
            className="btn btn-outline-orange mt-3 ms-2"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    );
  }

  // VISTA DETALLE
  if (isDetalleView) {
    const imagenUrl = getSafeImageUrl(detallePerro.imagen);
    
    return (
      <div className="container-fluid py-4">
        <button 
          className="btn btn-outline-secondary mb-4"
          onClick={handleVolverLista}
        >
          ← Volver a la lista
        </button>
        
        {/* Banner de autenticación si no está logueado */}
        {!isAuthenticated && (
          <div className="alert alert-info mb-4">
            <i className="fas fa-info-circle me-2"></i>
            Estás viendo esta página en modo público. 
            <button 
              className="btn btn-link p-0 ms-1"
              onClick={() => navigate("/login", { state: { from: `/animales/${id}` } })}
            >
              Inicia sesión
            </button> 
            para más opciones.
          </div>
        )}
        
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <div className="row">
                  {/* Columna de imágenes */}
                  <div className="col-md-6">
                    <div className="sticky-top" style={{top: "20px"}}>
                      <Carousel interval={4000} className="mb-3">
                        <Carousel.Item>
                          <div className="ratio ratio-1x1">
                            <img 
                              className="d-block w-100 rounded-3 object-fit-cover"
                              src={imagenUrl} 
                              alt={detallePerro.nombre}
                              onError={(e) => {
                                console.error("Error cargando imagen:", imagenUrl);
                                e.target.src = "/img/perro.png";
                              }}
                            />
                          </div>
                        </Carousel.Item>
                      </Carousel>
                      
                      <div className="d-flex justify-content-center gap-2">
                        <div className="ratio ratio-1x1" style={{width: "80px"}}>
                          <img 
                            className="d-block w-100 rounded-3 object-fit-cover"
                            src={imagenUrl} 
                            alt="Miniatura"
                            onError={(e) => {
                              e.target.src = "/img/perro.png";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Columna de información */}
                  <div className="col-md-6">
                    <h1 className="text-primary mb-4">{detallePerro.nombre}</h1>
                    
                    {/* Badge tipo ingreso */}
                    <div className="mb-4">
                      <span className={`badge ${detallePerro.tipoIngreso === 'adopcion' ? 'bg-success' : 'bg-info'} fs-6 p-2`}>
                        {detallePerro.tipoIngreso === 'adopcion' ? 'Disponible para Adopción' : 'Necesita Hogar de Tránsito'}
                      </span>
                    </div>
                    
                    {/* Historia */}
                    <div className="mb-4">
                      <h3 className="text-primary mb-3">Historia</h3>
                      <div className="bg-light p-3 rounded-3">
                        <p className="mb-0 fs-5">{detallePerro.historia}</p>
                      </div>
                    </div>
                    
                    {/* Detalles */}
                    <div className="mb-4">
                      <h3 className="text-primary mb-3">Detalles</h3>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-venus-mars text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Sexo</small>
                              <strong className="fs-5">{detallePerro.sexo}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-birthday-cake text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Edad</small>
                              <strong className="fs-5">{detallePerro.edad} años</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-weight text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Peso</small>
                              <strong className="fs-5">{detallePerro.peso} kg</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-ruler text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Tamaño</small>
                              <strong className="fs-5">{detallePerro.tamaño}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-map-marker-alt text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Ubicación</small>
                              <strong className="fs-5">Buenos Aires, {detallePerro.ubicacion}</strong>
                            </div>
                          </div>
                        </div>
                        
                        {/* Información adicional */}
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-syringe text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Vacunas</small>
                              <strong className="fs-5">
                                {detallePerro.vacunas && detallePerro.vacunas.length > 0 
                                  ? "Completas" 
                                  : "En proceso"}
                              </strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-stethoscope text-primary me-2 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Castrado</small>
                              <strong className="fs-5">
                                {detallePerro.castrado ? "Sí" : "No"}
                              </strong>
                            </div>
                          </div>
                        </div>
                        
                        {detallePerro.discapacidad && (
                          <div className="col-12 mb-3">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-wheelchair text-primary me-2 fs-5"></i>
                              <div>
                                <small className="text-muted d-block">Condición especial</small>
                                <strong className="fs-5">{detallePerro.discapacidad}</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="d-grid gap-3 d-md-flex mt-5">
                      {isAuthenticated ? (
                        <button 
                          className="btn btn-primary btn-lg px-5 py-3 flex-fill"
                          onClick={() => handleAccion(detallePerro)}
                        >
                          <i className="fas fa-heart me-2"></i>
                          {detallePerro.tipoIngreso === 'adopcion' ? 'Adoptar' : 'Ser Hogar de Tránsito'}
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-lg px-5 py-3 flex-fill"
                          onClick={() => navigate("/login", { 
                            state: { 
                              from: `/animales/${id}`,
                              message: `Para ${detallePerro.tipoIngreso === 'adopcion' ? 'adoptar' : 'ser hogar de tránsito'} a ${detallePerro.nombre}, necesitas iniciar sesión.` 
                            } 
                          })}
                        >
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Inicia sesión para {detallePerro.tipoIngreso === 'adopcion' ? 'Adoptar' : 'Ayudar'}
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-outline-primary btn-lg px-5 py-3 flex-fill"
                        onClick={handleVolverLista}
                      >
                        <i className="fas fa-dog me-2"></i>
                        Ver otros animales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA LISTA
  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="title_orange mb-0">Nuestros Animales en Adopción</h1>
        
        {/* Indicador de estado de autenticación */}
        {!isAuthenticated && (
          <div className="alert alert-info py-2 mb-0">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              Modo público - 
              <button 
                className="btn btn-link p-0 ms-1"
                onClick={() => navigate("/login", { state: { from: "/animales" } })}
              >
                Inicia sesión
              </button> 
              para más opciones
            </small>
          </div>
        )}
      </div>
      
      {/* Barra de filtros */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Tipo</label>
              <select 
                className="form-select"
                value={filters.tipoIngreso}
                onChange={(e) => setFilters({...filters, tipoIngreso: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="adopcion">Adopción</option>
                <option value="transito">Tránsito</option>
              </select>
            </div>
            
            <div className="col-md-2 mb-3">
              <label className="form-label">Tamaño</label>
              <select 
                className="form-select"
                value={filters.tamaño}
                onChange={(e) => setFilters({...filters, tamaño: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            
            <div className="col-md-2 mb-3">
              <label className="form-label">Sexo</label>
              <select 
                className="form-select"
                value={filters.sexo}
                onChange={(e) => setFilters({...filters, sexo: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            
            <div className="col-md-2 mb-3">
              <label className="form-label">Edad</label>
              <select 
                className="form-select"
                value={filters.edad}
                onChange={(e) => setFilters({...filters, edad: e.target.value})}
              >
                <option value="todos">Todas</option>
                <option value="cachorro">Cachorro (0-2 años)</option>
                <option value="adulto">Adulto (3-7 años)</option>
                <option value="mayor">Mayor (+7 años)</option>
              </select>
            </div>
            
            <div className="col-md-3 mb-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                disabled={Object.values(filters).every(val => val === "todos")}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
          
          {/* Información de filtros */}
          <div className="mt-2">
            <small className="text-muted">
              Mostrando {filteredPerros.length} de {perros.length} animales
              {Object.values(filters).some(val => val !== "todos") && 
                " (con filtros aplicados)"}
            </small>
          </div>
        </div>
      </div>
      
      {/* Lista de animales */}
      {filteredPerros.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 mb-3">🐕</div>
          <h3>No se encontraron animales</h3>
          <p className="text-muted">
            {perros.length === 0 
              ? "No hay animales disponibles en este momento." 
              : "No hay animales que coincidan con los filtros aplicados."}
          </p>
          {perros.length > 0 && (
            <button 
              className="btn btn_navbar mt-3"
              onClick={clearFilters}
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredPerros.map((perro) => {
            const imagenUrl = getSafeImageUrl(perro.imagen);
            
            return (
              <div key={perro._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div style={{ height: "250px", overflow: "hidden" }}>
                    <img 
                      src={imagenUrl} 
                      className="card-img-top h-100 w-100" 
                      alt={perro.nombre}
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        console.error("Error cargando imagen para", perro.nombre, ":", imagenUrl);
                        e.target.src = "/img/perro.png";
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title mb-0">{perro.nombre}</h5>
                      <span className={`badge ${perro.tipoIngreso === 'adopcion' ? 'bg-success' : 'bg-info'}`}>
                        {perro.tipoIngreso === 'adopcion' ? 'Adopción' : 'Tránsito'}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="mb-1">
                        <i className="fas fa-venus-mars me-2"></i>
                        <strong>Sexo:</strong> {perro.sexo}
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-birthday-cake me-2"></i>
                        <strong>Edad:</strong> {perro.edad} años
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-ruler-combined me-2"></i>
                        <strong>Tamaño:</strong> {perro.tamaño}
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        <strong>Ubicación:</strong> {perro.ubicacion}
                      </p>
                    </div>
                    
                    {perro.historia && (
                      <div className="mt-3">
                        <p className="card-text small text-muted">
                          {perro.historia.length > 100 
                            ? perro.historia.substring(0, 100) + '...' 
                            : perro.historia}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn_navbar"
                        onClick={() => handleVerDetalles(perro._id)}
                      >
                        <i className="fas fa-eye me-2"></i>
                        Ver Detalles
                      </button>
                      
                      {!isAuthenticated && (
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate("/login", { 
                            state: { 
                              from: `/animales/${perro._id}`,
                              message: `Para interactuar con ${perro.nombre}, necesitas iniciar sesión.` 
                            } 
                          })}
                        >
                          <i className="fas fa-sign-in-alt me-1"></i>
                          Inicia sesión
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Animales;