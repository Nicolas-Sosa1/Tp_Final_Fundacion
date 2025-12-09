import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Actividades = () => {
  const [solicitudes, setSolicitudes] = useState({
    adopciones: [],
    transitos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token_user");
      if (!token) {
        setError("No estás autenticado");
        setLoading(false);
        return;
      }

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          token_user: token,
        },
      };

      const response = await axios.get(
        `${baseURL}/api/solicitudes/mis-solicitudes`,
        config
      );

      if (response.data.success) {
        setSolicitudes({
          adopciones: response.data.adopciones || [],
          transitos: response.data.transitos || [],
        });
      } else {
        setError("Error al cargar las solicitudes");
      }
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      if (err.response?.status === 401) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token_user");
        window.location.href = "/login";
      } else {
        setError("Error al cargar las actividades");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "aprobada":
        return { className: "bg-success", text: "Aprobada ✓" };
      case "rechazada":
        return { className: "bg-danger", text: "Rechazada ✗" };
      case "pendiente":
        return { className: "bg-warning text-dark", text: "Pendiente ⏳" };
      default:
        return { className: "bg-secondary", text: estado || "Pendiente" };
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Mis Actividades</h2>
            <button
              onClick={cargarSolicitudes}
              className="btn btn-light btn-sm"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "🔄 Actualizar"}
            </button>
          </div>
        </div>
        <div className="card-body">
          <p className="lead">
            Aquí puedes ver el estado de tus solicitudes de adopción y tránsito.
          </p>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando tus actividades...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        📝 Solicitudes de Adopción
                        <span className="badge bg-light text-dark ms-2">
                          {solicitudes.adopciones.length}
                        </span>
                      </h5>
                    </div>
                    <div className="card-body">
                      {solicitudes.adopciones &&
                      solicitudes.adopciones.length > 0 ? (
                        <div className="list-group">
                          {solicitudes.adopciones.map((solicitud) => {
                            const estadoBadge = getEstadoBadge(
                              solicitud.estadoSolicitud
                            );
                            return (
                              <div
                                key={solicitud._id}
                                className="list-group-item"
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">
                                      {solicitud.animal?.nombre || "Animal"}
                                    </h6>
                                    <small className="text-muted d-block">
                                      📅 {formatFecha(solicitud.createdAt)}
                                    </small>
                                    <small className="text-muted">
                                      🏠{" "}
                                      {solicitud.viviendaTipo ||
                                        "No especificado"}
                                    </small>
                                  </div>
                                  <span
                                    className={`badge ${estadoBadge.className} ms-2`}
                                  >
                                    {estadoBadge.text}
                                  </span>
                                </div>
                                {solicitud.motivoAdopcion && (
                                  <div className="mt-2">
                                    <small className="text-muted">
                                      <strong>Motivo:</strong>{" "}
                                      {solicitud.motivoAdopcion.substring(
                                        0,
                                        100
                                      )}
                                      ...
                                    </small>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-2">
                            No tienes solicitudes de adopción
                          </p>
                          <Link
                            to="/formulario/adopcion"
                            className="btn btn-outline-primary btn-sm"
                          >
                            Crear nueva solicitud
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        🏠 Solicitudes de Tránsito
                        <span className="badge bg-light text-dark ms-2">
                          {solicitudes.transitos.length}
                        </span>
                      </h5>
                    </div>
                    <div className="card-body">
                      {solicitudes.transitos &&
                      solicitudes.transitos.length > 0 ? (
                        <div className="list-group">
                          {solicitudes.transitos.map((solicitud) => {
                            const estadoBadge = getEstadoBadge(
                              solicitud.estadoSolicitud
                            );
                            return (
                              <div
                                key={solicitud._id}
                                className="list-group-item"
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">
                                      {solicitud.animal?.nombre || "Animal"}
                                    </h6>
                                    <small className="text-muted d-block">
                                      📅 {formatFecha(solicitud.createdAt)}
                                    </small>
                                    <small className="text-muted">
                                      ⏱️{" "}
                                      {solicitud.tiempoDisponible ||
                                        "No especificado"}
                                    </small>
                                  </div>
                                  <span
                                    className={`badge ${estadoBadge.className} ms-2`}
                                  >
                                    {estadoBadge.text}
                                  </span>
                                </div>
                                {solicitud.experienciaConAnimales && (
                                  <div className="mt-2">
                                    <small className="text-muted">
                                      <strong>Experiencia:</strong>{" "}
                                      {solicitud.experienciaConAnimales.substring(
                                        0,
                                        100
                                      )}
                                      ...
                                    </small>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-2">
                            No tienes solicitudes de tránsito
                          </p>
                          <Link
                            to="/formulario/transito"
                            className="btn btn-outline-warning btn-sm"
                          >
                            Ofrecer tránsito
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4>¿Qué puedes hacer ahora?</h4>
                <div className="row mt-3">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5 className="card-title">👀 Ver animales</h5>
                        <p className="card-text">
                          Explora otros animales que necesitan un hogar
                        </p>
                        <Link
                          to="/animales"
                          className="btn btn-outline-primary"
                        >
                          Ver Animales
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5 className="card-title">🏡 Inicio</h5>
                        <p className="card-text">
                          Volver a la página principal
                        </p>
                        <Link to="/home" className="btn btn-outline-success">
                          Ir al Inicio
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5 className="card-title">❤️ Donar</h5>
                        <p className="card-text">
                          Ayuda a los animales con una donación
                        </p>
                        <Link to="/donar" className="btn btn-outline-danger">
                          Hacer Donación
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actividades;
