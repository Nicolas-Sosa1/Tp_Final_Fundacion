import styles from "../css/HomeAdmin.module.css";
import DogGrid from "../components/DogGrid";
import { useState } from "react";

const HomeAdmin = () => {
  const perros = [
    {
      id: 1,
      nombre: "Lucio",
      edad: "1,5 año",
      peso: "12 kg",
      tamanio: "mediano",
      genero: "macho",
      foto: "src/assets/dogs/lucio.jpg",
      tipo: "adopcion",
    },
    {
      id: 2,
      nombre: "Lobita",
      edad: "2 años",
      peso: "9 kg",
      tamanio: "mediano",
      genero: "hembra",
      foto: "src/assets/dogs/lobita.jpg",
      tipo: "adopcion",
    },
    {
      id: 3,
      nombre: "Pluto",
      edad: "6 meses",
      peso: "6 kg",
      tamanio: "chico",
      genero: "macho",
      foto: "src/assets/dogs/pluto.jpg",
      tipo: "adopcion",
    },
    {
      id: 4,
      nombre: "Papita",
      edad: "3 meses",
      peso: "5 kg",
      tamanio: "chico",
      genero: "hembra",
      foto: "src/assets/dogs/papita.jpg",
      tipo: "adopcion",
    },
    {
      id: 5,
      nombre: "Papita",
      edad: "3 meses",
      peso: "5 kg",
      tamanio: "chico",
      genero: "hembra",
      foto: "src/assets/dogs/papita.jpg",
      tipo: "adopcion",
    },
  ];

  const [activeTab, setActiveTab] = useState("adopcion");

  const perrosFiltrados = perros.filter((perro) => perro.tipo === activeTab);
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
          <DogGrid perros={perrosFiltrados} />
        </section>
      </div>
    </main>
  );
};

export default HomeAdmin;
