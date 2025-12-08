import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../css/admin/PostulantesTabla.module.css";

const PostulantesTabla = ({ postulaciones = [] }) => {
  const [activeTab, setActiveTab] = useState("todos");
  const { id } = useParams();

  
  const mapEstado = {
    aprobada: "Aceptada",
    pendiente: "Pendiente",
    rechazada: "Rechazada"
  };

  const filtradas = postulaciones;

  const estadoClase = {
    Aceptada: styles.aceptada,
    Pendiente: styles.pendiente,
    Rechazada: styles.rechazada
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
          {filtradas.map((p, index) => {
            // Convertimos estado de la BD → UI
            const estadoUI = mapEstado[p.estadoSolicitud] || "Pendiente";

            return (
              <tr key={p._id}>
                <td>{index + 1}</td>

                <td>
                  <span
                    className={`${styles.estado} ${
                      estadoClase[estadoUI]
                    }`}
                  >
                    {estadoUI}
                  </span>
                </td>

                <td>{p.nombre} {p.apellido}</td>
                <td>{p.edad}</td>
                <td>{p.zona}</td>

                <td>
                  <Link
                    to={`/homeadmin/perro/${id}/postulacion/${p._id}`}
                    className={styles.viewLink}
                  >
                    📝
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default PostulantesTabla;
