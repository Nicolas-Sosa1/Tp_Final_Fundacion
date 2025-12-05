import { useState } from "react";
import styles from "../../css/admin/HomeAdmin.module.css";
import DogGrid from "../../components/DogGrid";
import { perros } from "../../data/perros";

const HomeAdmin = () => {
  const [activeTab, setActiveTab] = useState("adopcion");
  const getDogLink = (perro) => `/homeadmin/${perro.id}`;
  const perrosFiltrados = perros.filter(
    (perro) =>
      (activeTab === "adopcion" && perro.estado === "En adopción") ||
      (activeTab === "transito" && perro.estado === "En tránsito")
  );
  return (
    <main className={styles.homeadmin}>
      <header className={styles.homeheader}>
        <h1>Ver postulaciones</h1>
        <input
          className={styles.searchinput}
          type="text"
          placeholder="Buscar por nombre"
        />
      </header>

      <div className="postulacionesWrapper">
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "adopcion" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("adopcion")}
          >
            Buscan adopción
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "transito" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("transito")}
          >
            Buscan tránsito
          </button>
        </nav>

        <section className={styles.postulaciones}>
          <DogGrid perros={perrosFiltrados} getLink={getDogLink} />
        </section>
      </div>
    </main>
  );
};

export default HomeAdmin;
