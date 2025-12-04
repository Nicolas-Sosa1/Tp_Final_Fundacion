import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import styles from "../css/admin/PostulantesTabla.module.css";

const PostulantesTabla = ({ postulaciones = [] }) => {
  const [activeTab, setActiveTab] = useState("todos");
  const { perroId } = useParams();

  const filtradas =
    activeTab === "no-vistos"
      ? postulaciones.filter((p) => !p.vista)
      : postulaciones;

  const estadoClase = {
    Aceptada: styles.aceptada,
    Pendiente: styles.pendiente,
    Rechazada: styles.rechazada,
    "No leída": styles.novisto,
  };

  return (
    <section className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "todos" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("todos")}
        >
          Todos los postulantes
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === "no-vistos" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("no-vistos")}
        >
          Postulantes no vistos
        </button>
      </div>

      {/* Tabla */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Zona</th>
            <th>Ver</th>
          </tr>
        </thead>

        <tbody>
          {filtradas.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>
                <span
                  className={`${styles.estado} ${
                    estadoClase[p.estado] || styles.novisto
                  }`}
                >
                  {p.estado || "No leído"}
                </span>
              </td>
              <td>{p.respuestas?.[3]}</td> {/* Nombre */}
              <td>{p.respuestas?.[4]}</td> {/* Edad */}
              <td>{p.respuestas?.[5]}</td> {/* Zona */}
              <td>
                <Link
                  to={`/homeadmin/${perroId}/postulacion/${p.id}`}
                  className={styles.viewLink}
                >
                  📝
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PostulantesTabla;
