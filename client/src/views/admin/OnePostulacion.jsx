import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Breadcrumbs from "../../components/BreadcrumbsAdmin";
import styles from "../../css/admin/OnePostulacion.module.css";

const OnePostulacion = () => {
  const { postulacionId } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [evaluacion, setEvaluacion] = useState({});
  const [loading, setLoading] = useState(true);

  // ================================
  // CARGAR SOLICITUD REAL DESDE BD
  // ================================
  useEffect(() => {
  const fetchSolicitud = async () => {
    try {
      const token = localStorage.getItem("token_user");
      const res = await axios.get(
        "http://localhost:8000/api/solicitudes/adopcion",
        { headers: { token_user: token } }
      );

      const encontrada = res.data.find((s) => s._id === postulacionId);

      // ⛔️ CHECK PARA DEBUG DE POPULATE
      if (!encontrada?.animal) {
        console.error("La solicitud no tiene el animal populado");
      }

      setSolicitud(encontrada);
      setLoading(false);
    } catch (e) {
      console.log("Error cargando solicitud:", e);
      setLoading(false);
    }
  };

  fetchSolicitud();
}, [postulacionId]);


  if (loading) return <p>Cargando solicitud...</p>;
  if (!solicitud) return <p>No se encontró la solicitud</p>;

  const perro = solicitud.animal; // viene populado desde BD

  const handleEvaluar = (numPregunta, valor) => {
    setEvaluacion((prev) => ({
      ...prev,
      [numPregunta]: valor,
    }));
  };

  const handleFinalizar = async (estadoFinal) => {
    try {
      const token = localStorage.getItem("token_user");

      await axios.patch(
        `http://localhost:8000/api/solicitudes/adopcion/${postulacionId}/estado`,
        { estado: estadoFinal },
        { headers: { token_user: token } }
      );

      alert("Estado actualizado correctamente");

      navigate(`/homeadmin/perro/${perro._id}/postulaciones`);
    } catch (e) {
      console.log(e);
      alert("Error al actualizar estado");
    }
  };

  return (
    <main className={styles.page}>
      <Breadcrumbs perro={perro} postulacion={solicitud} />

      <h1 className={styles.title}>
        Postulación de{" "}
        <span className={styles.applicant}>
          {solicitud.nombre} {solicitud.apellido}
        </span>{" "}
        para adoptar a{" "}
        <span className={styles.dogName}>{perro.nombre}</span>
      </h1>

      {/* Acciones */}
      <header className={styles.header}>
        <div className={styles.actions}>
          <button
            className={styles.accept}
            onClick={() => handleFinalizar("aprobada")}
          >
            Aceptar
          </button>

          <button
            className={styles.pending}
            onClick={() => handleFinalizar("pendiente")}
          >
            Pendiente
          </button>

          <button
            className={styles.reject}
            onClick={() => handleFinalizar("rechazada")}
          >
            Rechazar
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
          <p className={styles.answer}>{solicitud.edad}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Zona</h4>
          <p className={styles.answer}>{solicitud.zona}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Dirección</h4>
          <p className={styles.answer}>{solicitud.direccion}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Motivo de adopción</h4>
          <p className={styles.answer}>{solicitud.motivoAdopcion}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Vivienda</h4>
          <p className={styles.answer}>{solicitud.viviendaTipo}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Convivientes</h4>
          <p className={styles.answer}>{solicitud.convivientes}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Experiencia con animales</h4>
          <p className={styles.answer}>{solicitud.experienciaConAnimales}</p>
        </div>

        <div className={styles.questionCard}>
          <h4>Horas fuera de casa</h4>
          <p className={styles.answer}>{solicitud.horasFueraDeCasa}</p>
        </div>
      </section>
    </main>
  );
};

export default OnePostulacion;
