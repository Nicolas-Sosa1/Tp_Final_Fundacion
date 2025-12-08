import { useState, useEffect } from "react";
import axios from "axios";
import DogGrid from "./DogGrid";
import styles from "../css/DogsConFilters.module.css";

const DogsConFilters = ({ defaultFilters = {}, context = "todos" }) => {
  const [perros, setPerros] = useState([]);

  const [filters, setFilters] = useState({
    tipoIngreso: defaultFilters.tipoIngreso || "todos", 
    estadoGeneral: defaultFilters.estadoGeneral ?? "todos",
    tamaño: "todos",
    sexo: "todos",
  });

  const getDogLink = (perro) => `/homeadmin/perro/${perro._id}`;

  useEffect(() => {
    const fetchPerros = async () => {
      try {
        let lista = [];

        if (context === "todos") {
          const adopcion = await axios.get("http://localhost:8000/api/animals/public/adopcion");
          const transito = await axios.get("http://localhost:8000/api/animals/public/transito");
          lista = [...adopcion.data, ...transito.data];
        }

        if (context === "adoptados") {
          const adopcionBaja = await axios.get("http://localhost:8000/api/animals/public/adopcion/baja");
          const transitoBaja = await axios.get("http://localhost:8000/api/animals/public/transito/baja");
          lista = [...adopcionBaja.data, ...transitoBaja.data];
        }

        setPerros(lista);
      } catch (e) {
        console.log("Error cargando perros:", e);
      }
    };

    fetchPerros();
  }, [context]);

  const perrosFiltrados = perros.filter((p) => {
    // FILTRO DE NECESIDAD REAL (adopción / tránsito)
    if (filters.tipoIngreso !== "todos" && p.tipoIngreso !== filters.tipoIngreso)
      return false;

    // ESTADO
    if (filters.estadoGeneral !== "todos") {
      if (filters.estadoGeneral === true && p.estadoGeneral !== true) return false;
      if (filters.estadoGeneral === false && p.estadoGeneral !== false) return false;
    }

    // TAMAÑO
    if (filters.tamaño !== "todos" && p.tamaño !== filters.tamaño)
      return false;

    // SEXO
    if (filters.sexo !== "todos" && p.sexo !== filters.sexo)
      return false;

    return true;
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {context === "adoptados" ? "Perritos adoptados" : "Todos los perros"}
        </h1>

        <div className={styles.filtersBar}>

          {/* NECESIDAD (ADOPCIÓN / TRÁNSITO) */}
          <select
            value={filters.tipoIngreso}
            onChange={(e) =>
              setFilters({ ...filters, tipoIngreso: e.target.value })
            }
          >
            <option value="todos">Necesidad</option>
            <option value="adopcion">Adopción</option>
            <option value="transito">Tránsito</option>
          </select>

          {/* ESTADO */}
          <select
            value={filters.estadoGeneral}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({
                ...filters,
                estadoGeneral:
                  val === "true" ? true :
                  val === "false" ? false :
                  "todos",
              });
            }}
          >
            <option value="todos">Estado</option>
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>

          {/* TAMAÑO */}
          <select
            value={filters.tamaño}
            onChange={(e) =>
              setFilters({ ...filters, tamaño: e.target.value })
            }
          >
            <option value="todos">Tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>

          {/* SEXO */}
          <select
            value={filters.sexo}
            onChange={(e) =>
              setFilters({ ...filters, sexo: e.target.value })
            }
          >
            <option value="todos">Sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>

          <button
            className={styles.clear}
            onClick={() =>
              setFilters({
                tipoIngreso: "todos",
                estadoGeneral: "todos",
                tamaño: "todos",
                sexo: "todos",
              })
            }
          >
            Limpiar
          </button>
        </div>
      </header>

      <section className={styles.gridWrapper}>
        <DogGrid perros={perrosFiltrados} getLink={getDogLink} />
      </section>
    </main>
  );
};

export default DogsConFilters;
