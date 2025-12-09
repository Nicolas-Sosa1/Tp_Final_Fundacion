import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Actividades = () => {
    const [solicitudes, setSolicitudes] = useState({ adopciones: [], transitos: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarSolicitudes = async () => {
        try {
            console.log("🔄 Iniciando carga de solicitudes...");
            
            const token = localStorage.getItem("token_user");
            if (!token) {
                console.warn("⚠️ No hay token en localStorage");
                setError("No estás autenticado. Por favor, inicia sesión.");
                setLoading(false);
                return;
            }

            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const url = `${baseURL}/api/solicitudes/mis-solicitudes`;
            
            console.log("🔗 URL de conexión:", url);
            console.log("🔑 Token (primeros 20 chars):", token.substring(0, 20) + "...");
            
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'token_user': token,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 segundos timeout
            };

            console.log("📤 Enviando solicitud...");
            const response = await axios.get(url, config);
            console.log("📦 Respuesta recibida:", response.data);
            
            // ✅ CORRECCIÓN: Manejar formato de respuesta
            const responseData = response.data;
            
            if (responseData.success === true) {
                // Formato nuevo con campo success
                setSolicitudes({
                    adopciones: responseData.adopciones || [],
                    transitos: responseData.transitos || []
                });
            } else if (responseData.adopciones !== undefined || responseData.transitos !== undefined) {
                // Formato antiguo (backward compatibility)
                setSolicitudes({
                    adopciones: responseData.adopciones || [],
                    transitos: responseData.transitos || []
                });
            } else {
                console.error("❌ Formato de respuesta inesperado:", responseData);
                setError("Formato de respuesta inesperado del servidor");
            }
            
        } catch (err) {
            console.error("❌ Error detallado en cargarSolicitudes:", err);
            
            if (err.code === 'ERR_NETWORK') {
                setError("❌ ERROR DE CONEXIÓN: No se puede conectar al servidor. Verifica que:\n" +
                        "1. El servidor esté corriendo en http://localhost:8000\n" +
                        "2. No haya problemas de firewall\n" +
                        "3. La URL sea correcta");
            } else if (err.response) {
                // El servidor respondió con un código de error
                console.log("📊 Respuesta de error del servidor:", {
                    status: err.response.status,
                    data: err.response.data
                });
                
                if (err.response.status === 401) {
                    setError("🔒 Tu sesión ha expirado. Serás redirigido al login...");
                    localStorage.removeItem("token_user");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 3000);
                } else if (err.response.status === 404) {
                    setError("🔍 Endpoint no encontrado. Verifica la URL de la API.");
                } else if (err.response.status === 500) {
                    setError("⚙️ Error interno del servidor. Contacta al administrador.");
                } else {
                    setError(`Error ${err.response.status}: ${err.response.data?.message || 'Error del servidor'}`);
                }
            } else if (err.request) {
                // La petición fue hecha pero no hubo respuesta
                setError("⏳ El servidor no respondió. Verifica que esté corriendo.");
            } else {
                setError("⚠️ Error desconocido: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const getEstadoBadge = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'aprobada':
                return { className: 'bg-success text-white', text: 'Aprobada ✓' };
            case 'rechazada':
                return { className: 'bg-danger text-white', text: 'Rechazada ✗' };
            case 'pendiente':
                return { className: 'bg-warning text-dark', text: 'Pendiente ⏳' };
            default:
                return { className: 'bg-secondary text-white', text: estado || 'Pendiente' };
        }
    };

    const formatFecha = (fecha) => {
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha no disponible';
        }
    };

    const CardSolicitud = ({ tipo, solicitud, esAdopcion = true }) => {
        const estadoBadge = getEstadoBadge(solicitud.estadoSolicitud);
        const animalNombre = solicitud.animal?.nombre || 'Animal';
        
        return (
            <div className="card mb-3 shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <h5 className="card-title mb-1">
                                {animalNombre}
                                <small className="text-muted ms-2">
                                    {esAdopcion ? '🐕 Adopción' : '🏠 Tránsito'}
                                </small>
                            </h5>
                            <p className="card-text mb-1">
                                <small className="text-muted">
                                    📅 {formatFecha(solicitud.createdAt)}
                                </small>
                            </p>
                            {esAdopcion ? (
                                <p className="card-text mb-1">
                                    <small>
                                        <strong>Vivienda:</strong> {solicitud.viviendaTipo || 'No especificado'}
                                    </small>
                                </p>
                            ) : (
                                <p className="card-text mb-1">
                                    <small>
                                        <strong>Tiempo disponible:</strong> {solicitud.tiempoDisponible || 'No especificado'}
                                    </small>
                                </p>
                            )}
                        </div>
                        <span className={`badge ${estadoBadge.className} ms-2`}>
                            {estadoBadge.text}
                        </span>
                    </div>
                    
                    {esAdopcion && solicitud.motivoAdopcion && (
                        <div className="mt-2">
                            <p className="card-text">
                                <small>
                                    <strong>Motivo:</strong> {solicitud.motivoAdopcion}
                                </small>
                            </p>
                        </div>
                    )}
                    
                    {!esAdopcion && solicitud.experienciaConAnimales && (
                        <div className="mt-2">
                            <p className="card-text">
                                <small>
                                    <strong>Experiencia:</strong> {solicitud.experienciaConAnimales}
                                </small>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">📋 Mis Actividades</h2>
                        <button 
                            onClick={cargarSolicitudes}
                            className="btn btn-light btn-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Actualizando...
                                </>
                            ) : '🔄 Actualizar'}
                        </button>
                    </div>
                </div>
                
                <div className="card-body">
                    <p className="lead">
                        Aquí puedes ver el estado de todas tus solicitudes de adopción y tránsito.
                    </p>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando tus actividades...</p>
                            <p className="text-muted small">
                                Esto puede tomar unos segundos la primera vez
                            </p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <h5 className="alert-heading">❌ Error</h5>
                            <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{error}</p>
                            <hr />
                            <button 
                                onClick={cargarSolicitudes}
                                className="btn btn-outline-danger btn-sm"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Sección de Adopciones */}
                            <div className="mb-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">
                                        <span className="badge bg-info me-2">
                                            {solicitudes.adopciones.length}
                                        </span>
                                        📝 Solicitudes de Adopción
                                    </h4>
                                    <Link 
                                        to="/formulario/adopcion" 
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        + Nueva Adopción
                                    </Link>
                                </div>
                                
                                {solicitudes.adopciones.length > 0 ? (
                                    <div className="row">
                                        {solicitudes.adopciones.map((solicitud) => (
                                            <div key={solicitud._id} className="col-md-6 mb-3">
                                                <CardSolicitud 
                                                    tipo="adopcion"
                                                    solicitud={solicitud}
                                                    esAdopcion={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">
                                        <p className="mb-3">No tienes solicitudes de adopción registradas.</p>
                                        <Link to="/animales" className="btn btn-primary">
                                            Ver animales disponibles para adopción
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* Sección de Tránsitos */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">
                                        <span className="badge bg-warning me-2">
                                            {solicitudes.transitos.length}
                                        </span>
                                        🏠 Solicitudes de Tránsito
                                    </h4>
                                    <Link 
                                        to="/formulario/transito" 
                                        className="btn btn-outline-warning btn-sm"
                                    >
                                        + Ofrecer Tránsito
                                    </Link>
                                </div>
                                
                                {solicitudes.transitos.length > 0 ? (
                                    <div className="row">
                                        {solicitudes.transitos.map((solicitud) => (
                                            <div key={solicitud._id} className="col-md-6 mb-3">
                                                <CardSolicitud 
                                                    tipo="transito"
                                                    solicitud={solicitud}
                                                    esAdopcion={false}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-warning text-center">
                                        <p className="mb-3">No tienes solicitudes de tránsito registradas.</p>
                                        <Link to="/animales?tipo=transito" className="btn btn-warning">
                                            Ver animales que necesitan tránsito
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* Acciones rápidas */}
                            <div className="mt-5">
                                <h5>💡 ¿Qué puedes hacer ahora?</h5>
                                <div className="row mt-3">
                                    <div className="col-md-4 mb-3">
                                        <div className="card text-center h-100 border-primary">
                                            <div className="card-body">
                                                <h5 className="card-title">👀 Ver todos los animales</h5>
                                                <p className="card-text">Explora otros animales que necesitan un hogar</p>
                                                <Link to="/animales" className="btn btn-primary">
                                                    Explorar
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div className="card text-center h-100 border-success">
                                            <div className="card-body">
                                                <h5 className="card-title">🏡 Ir al inicio</h5>
                                                <p className="card-text">Volver a la página principal</p>
                                                <Link to="/home" className="btn btn-success">
                                                    Inicio
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div className="card text-center h-100 border-danger">
                                            <div className="card-body">
                                                <h5 className="card-title">❤️ Hacer una donación</h5>
                                                <p className="card-text">Ayuda a los animales con una donación</p>
                                                <Link to="/donar" className="btn btn-danger">
                                                    Donar
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="card-footer text-muted small">
                    <div className="row">
                        <div className="col-md-6">
                            <strong>Total solicitudes:</strong> {solicitudes.adopciones.length + solicitudes.transitos.length}
                        </div>
                        <div className="col-md-6 text-end">
                            Última actualización: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actividades;