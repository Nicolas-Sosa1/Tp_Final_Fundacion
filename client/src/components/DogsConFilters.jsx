import { useState } from "react";
import { perros } from "../data/perros";
import DogGrid from "./DogGrid";
import styles from "../css/DogsConFilters.module.css";

const DogsConFilters = ({ defaultFilters = {}, context = "todos" }) => {
  const [filters, setFilters] = useState({
    necesidad: "todos",
    estado: defaultFilters.estado || "todos",
    tamanio: "todos",
    genero: "todos",
  });

  const getDogLink = (perro) => {
    // Si estoy en la vista dedicada de postulaciones → siempre ir a postulaciones
    if (context === "postulaciones") {
      return `/homeadmin/perro/${perro.id}/postulaciones`;
    }

    // Si el filtro actual es "conPostulaciones" → ir a postulaciones
    if (filters.estado === "conPostulaciones") {
      return `/homeadmin/perro/${perro.id}/postulaciones`;
    }

    // Si estamos en AllDogs (todos) o filtros distintos, siempre ir a admin
    return `/homeadmin/perro/${perro.id}`;
  };

  const perrosFiltrados = perros.filter((p) => {
    // NECESIDAD
    if (filters.necesidad !== "todos" && p.necesidad !== filters.necesidad)
      return false;

    // ESTADO OPERATIVO
    if (filters.estado !== "todos") {
      if (
        filters.estado === "conPostulaciones" &&
        (!p.postulaciones || p.postulaciones.length === 0)
      )
        return false;

      if (
        filters.estado === "sinPostulaciones" &&
        p.postulaciones &&
        p.postulaciones.length > 0
      )
        return false;

      if (filters.estado === "adoptado" && !p.isAdopted) return false;

      if (filters.estado === "conTransito" && !p.hasTransitHome) return false;
    }

    if (filters.tamanio !== "todos" && p.tamanio !== filters.tamanio)
      return false;

    if (filters.genero !== "todos" && p.genero !== filters.genero) return false;

    return true;
  });

  const getDynamicTitle = () => {
    switch (filters.estado) {
      case "conPostulaciones":
        return "con postulaciones";
      case "sinPostulaciones":
        return "sin postulaciones";
      case "adoptado":
        return "que ya fueron adoptados";
      case "conTransito":
        return "que ya tienen tránsito";
      default:
        return "";
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Todos los perritos{" "}
          {getDynamicTitle() && (
            <span className={styles.highlight}>{getDynamicTitle()}</span>
          )}
        </h1>

        <div className={styles.filtersBar}>
          {/* ESTADO */}
          <select
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="todos">Estado</option>
            <option value="conPostulaciones">Con postulaciones</option>
            <option value="sinPostulaciones">Sin postulaciones</option>
            <option value="adoptado">Ya fue adoptado</option>
            <option value="conTransito">Ya tiene tránsito</option>
          </select>

          {/* NECESIDAD */}
          <select
            value={filters.necesidad}
            onChange={(e) =>
              setFilters({ ...filters, necesidad: e.target.value })
            }
          >
            <option value="todos">Necesidad</option>
            <option value="Adopción">Adopción</option>
            <option value="Tránsito">Tránsito</option>
          </select>

          <select
            value={filters.tamanio}
            onChange={(e) =>
              setFilters({ ...filters, tamanio: e.target.value })
            }
          >
            <option value="todos">Tamaño</option>
            <option value="chico">Chico</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>

          <select
            value={filters.genero}
            onChange={(e) => setFilters({ ...filters, genero: e.target.value })}
          >
            <option value="todos">Género</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>

          <button
            className={styles.clear}
            onClick={() =>
              setFilters({
                necesidad: "todos",
                estado: "todos",
                tamanio: "todos",
                genero: "todos",
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
