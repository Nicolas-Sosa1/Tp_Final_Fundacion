import { useState } from "react";
import styles from "../css/PostulantesTabla.module.css";

const PostulantesTabla = ({ postulaciones = [] }) => {
  const [activeTab, setActiveTab] = useState("todos");
  const listaBase = Array.isArray(postulaciones) ? postulaciones : [];

  const filtradas =
    activeTab === "no-vistos" ? listaBase.filter((p) => !p.vista) : listaBase;

  console.log("postulaciones:", postulaciones);
  console.log("es array?", Array.isArray(postulaciones));

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
              <td>{p.estado}</td>
              <td>{p.nombre}</td>
              <td>{p.edad}</td>
              <td>{p.zona}</td>
              <td>
                <a href={`/postulacion/${p.id}`} className={styles.viewLink}>
                  📝
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PostulantesTabla;
