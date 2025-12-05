import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { postulacionesPorPerro } from "../../data/postulaciones";
import { questions } from "../../data/preguntas";
import { perros } from "../../data/perros";

import Breadcrumbs from "../../components/BreadcrumbsAdmin";

import styles from "../../css/admin/OnePostulacion.module.css";

const OnePostulacion = () => {
  const { postulacionId } = useParams();
  const navigate = useNavigate();

  // Buscar la postulación
  const todasLasPostulaciones = Object.values(postulacionesPorPerro).flat();
  const postulacion = todasLasPostulaciones.find(
    (p) => p.id === Number(postulacionId)
  );

  // ✅ hooks SIEMPRE arriba
  const [evaluacion, setEvaluacion] = useState(postulacion?.evaluacion || {});

  // Guard clause AFTER hooks
  if (!postulacion) {
    return <p>Postulación no encontrada</p>;
  }

  // Buscar perro asociado
  const perroId = Number(
    Object.entries(postulacionesPorPerro).find(([, arr]) =>
      arr.some((p) => p.id === postulacion.id)
    )[0]
  );

  const perro = perros.find((p) => p.id === perroId);

  const contar = (valor) =>
    Object.values(evaluacion).filter((v) => v === valor).length;

  const handleEvaluar = (numPregunta, valor) => {
    setEvaluacion((prev) => ({
      ...prev,
      [numPregunta]: valor,
    }));
  };

  const handleFinalizar = (nuevoEstado) => {
    postulacion.estado = nuevoEstado;
    postulacion.vista = true;
    postulacion.evaluacion = evaluacion;

    navigate(`/homeadmin/${perroId}`);
  };

  return (
    <main className={styles.page}>
      <Breadcrumbs perro={perro} postulacion={postulacion} />

      <h1 className={styles.title}>
        Postulación de{" "}
        <span className={styles.applicant}>{postulacion.respuestas[3]}</span>{" "}
        para adoptar a <span className={styles.dogName}>{perro?.nombre}</span>
      </h1>

      <header className={styles.header}>
        <div className={styles.actions}>
          <button
            className={styles.accept}
            onClick={() => handleFinalizar("Aceptada")}
          >
            Aceptar
          </button>

          <button
            className={styles.pending}
            onClick={() => handleFinalizar("Pendiente")}
          >
            Pendiente
          </button>

          <button
            className={styles.reject}
            onClick={() => handleFinalizar("Rechazada")}
          >
            Rechazar
          </button>
        </div>

        <div className={styles.summary}>
          <span className={styles.green}>
            ✅ {contar("green")}/{questions.length}
          </span>
          <span className={styles.orange}>
            🟠 {contar("orange")}/{questions.length}
          </span>
          <span className={styles.red}>
            🔴 {contar("red")}/{questions.length}
          </span>
        </div>
      </header>

      <section className={styles.form}>
        {questions.map((q) => {
          const num = q.id;

          return (
            <div key={q.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h4>
                  {num}. {q.text}
                </h4>

                <div className={styles.rating}>
                  <span
                    className={`${styles.dot} ${styles.red} ${
                      evaluacion[num] === "red" ? styles.active : ""
                    }`}
                    onClick={() => handleEvaluar(num, "red")}
                  />

                  <span
                    className={`${styles.dot} ${styles.orange} ${
                      evaluacion[num] === "orange" ? styles.active : ""
                    }`}
                    onClick={() => handleEvaluar(num, "orange")}
                  />

                  <span
                    className={`${styles.dot} ${styles.green} ${
                      evaluacion[num] === "green" ? styles.active : ""
                    }`}
                    onClick={() => handleEvaluar(num, "green")}
                  />
                </div>
              </div>

              <p className={styles.answer}>
                {postulacion.respuestas[num] || "—"}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default OnePostulacion;
