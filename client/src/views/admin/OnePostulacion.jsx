import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Breadcrumbs from "../../components/BreadcrumbsAdmin";
import styles from "../../css/admin/OnePostulacion.module.css";
import axios from "../../../../server/config/Axios"; // ✅ Importar axios configurado

const OnePostulacion = () => {
  const { postulacionId } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Cargar solicitud
  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/solicitudes/adopcion/${postulacionId}`);
        
        if (!res.data) {
          throw new Error("Solicitud no encontrada");
        }

        setSolicitud(res.data);
        setError(null);
      } catch (err) {
        console.error("Error cargando solicitud:", err);
        setError("Error al cargar la solicitud");
        setSolicitud(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [postulacionId]);

  const handleFinalizar = async (estadoFinal) => {
    if (!window.confirm(`¿Cambiar estado a "${estadoFinal}"?`)) return;

    try {
      setUpdating(true);
      
      await axios.patch(
        `/api/solicitudes/adopcion/${postulacionId}/estado`,
        { estado: estadoFinal }
      );

      alert("Estado actualizado correctamente");
      
      // Actualizar estado local
      if (solicitud) {
        setSolicitud({
          ...solicitud,
          estadoSolicitud: estadoFinal
        });
      }

      // Navegar de vuelta
      if (solicitud?.animal?._id) {
        navigate(`/homeadmin/perro/${solicitud.animal._id}/postulaciones`);
      } else {
        navigate("/homeadmin/postulaciones");
      }
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("Error al actualizar estado: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando solicitud...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!solicitud) return <p className="text-center mt-5">No se encontró la solicitud</p>;

  const perro = solicitud.animal;

  return (
    <main className={styles.page}>
      <Breadcrumbs perro={perro} postulacion={solicitud} />

      <h1 className={styles.title}>
        Postulación de{" "}
        <span className={styles.applicant}>
          {solicitud.nombre} {solicitud.apellido}
        </span>{" "}
        para adoptar a{" "}
        <span className={styles.dogName}>{perro?.nombre || "Animal"}</span>
      </h1>

      {/* Estado actual */}
      <div className={styles.statusBadge}>
        Estado actual: <strong>{solicitud.estadoSolicitud?.toUpperCase() || "PENDIENTE"}</strong>
      </div>

      {/* Acciones */}
      <header className={styles.header}>
        <div className={styles.actions}>
          <button
            className={styles.accept}
            onClick={() => handleFinalizar("aprobada")}
            disabled={updating || solicitud.estadoSolicitud === "aprobada"}
          >
            {updating ? "Procesando..." : "Aceptar"}
          </button>

          <button
            className={styles.pending}
            onClick={() => handleFinalizar("pendiente")}
            disabled={updating || solicitud.estadoSolicitud === "pendiente"}
          >
            {updating ? "Procesando..." : "Pendiente"}
          </button>

          <button
            className={styles.reject}
            onClick={() => handleFinalizar("rechazada")}
            disabled={updating || solicitud.estadoSolicitud === "rechazada"}
          >
            {updating ? "Procesando..." : "Rechazar"}
          </button>
        </div>
      </header>

      {/* Información */}
      <section className={styles.form}>
        <div className={styles.questionCard}>
          <h4>Nombre completo</h4>
          <p className={styles.answer}>
            {solicitud.nombre} {solicitud.apellido}
          </p>
        </div>

        <div className={styles.questionCard}>
          <h4>Edad</h4>
          <p className={styles.answer}>{solicitud.edad || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Zona</h4>
          <p className={styles.answer}>{solicitud.zona || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Dirección</h4>
          <p className={styles.answer}>{solicitud.direccion || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Motivo de adopción</h4>
          <p className={styles.answer}>{solicitud.motivoAdopcion || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Vivienda</h4>
          <p className={styles.answer}>{solicitud.viviendaTipo || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Convivientes</h4>
          <p className={styles.answer}>{solicitud.convivientes || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Experiencia con animales</h4>
          <p className={styles.answer}>{solicitud.experienciaConAnimales || "No especificado"}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Horas fuera de casa</h4>
          <p className={styles.answer}>{solicitud.horasFueraDeCasa || "No especificado"}</p>
        </div>
      </section>
    </main>
  );
};

export default OnePostulacion;