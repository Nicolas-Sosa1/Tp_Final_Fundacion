import { useState, useEffect } from "react";
import axios from "axios";
import DogGrid from "./DogGrid";
import styles from "../css/DogsConFilters.module.css";

const DogsConFilters = ({ defaultFilters = {}, context = "todos" }) => {
  const [perros, setPerros] = useState([]);
  const [filters, setFilters] = useState({
    tipoIngreso: defaultFilters.tipoIngreso || "todos",
    estadoGeneral:
      defaultFilters.estadoGeneral ||
      defaultFilters.estado ||
      "todos",
    tamaño: "todos",
    sexo: "todos",
  });

  const getDogLink = (perro) => `/homeadmin/perro/${perro._id}`;

  useEffect(() => {
  const fetchPerros = async () => {
    try {
      let adopcion;
      let transito;

      if (context === "adoptados") {
        adopcion = await axios.get("http://localhost:8000/api/animals/public/adopcion/baja"); 
        transito = await axios.get("http://localhost:8000/api/animals/public/transito/baja");
      } else {
        adopcion = await axios.get("http://localhost:8000/api/animals/public/adopcion");
        transito = await axios.get("http://localhost:8000/api/animals/public/transito");
      }

      setPerros([...adopcion.data, ...transito.data]);

    } catch (e) {
      console.log("Error cargando perros:", e);
    }
  };

  fetchPerros();
}, [context]);


  const perrosFiltrados = perros.filter((p) => {
    if (filters.tipoIngreso !== "todos" && p.tipoIngreso !== filters.tipoIngreso)
      return false;

    if (filters.estadoGeneral !== "todos") {
      if (filters.estadoGeneral === "disponible" && p.estadoGeneral !== true)
        return false;
      if (filters.estadoGeneral === "no_disponible" && p.estadoGeneral !== false)
        return false;
    }

    if (filters.tamaño !== "todos" && p.tamaño !== filters.tamaño)
      return false;

    if (filters.sexo !== "todos" && p.sexo !== filters.sexo)
      return false;

    return true;
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Perros</h1>

        <div className={styles.filtersBar}>
          {/* tipoIngreso */}
          <select
            value={filters.tipoIngreso}
            onChange={(e) =>
              setFilters({ ...filters, tipoIngreso: e.target.value })
            }
          >
            <option value="todos">Ingreso</option>
            <option value="adopcion">Adopción</option>
            <option value="transito">Tránsito</option>
          </select>

          {/* estado */}
          <select
            value={filters.estadoGeneral}
            onChange={(e) =>
              setFilters({ ...filters, estadoGeneral: e.target.value })
            }
          >
            <option value="todos">Estado</option>
            <option value="disponible">Disponible</option>
            <option value="no_disponible">No disponible</option>
          </select>

          {/* tamaño */}
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

          {/* sexo */}
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
