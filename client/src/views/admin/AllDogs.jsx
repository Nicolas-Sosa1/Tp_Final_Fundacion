import { useState } from "react";
import { perros } from "../../data/perros";
import DogGrid from "../../components/DogGrid";
import styles from "../../css/admin/AllDogs.module.css";

const AllDogs = () => {
  const [filters, setFilters] = useState({
    estado: "todos",
    tamanio: "todos",
    genero: "todos",
  });

  const getDogLink = (perro) => `/homeadmin/perros/${perro.id}`;

  const perrosFiltrados = perros.filter((p) => {
    if (filters.estado !== "todos" && p.estado !== filters.estado) return false;
    if (filters.tamanio !== "todos" && p.tamanio !== filters.tamanio)
      return false;
    if (filters.genero !== "todos" && p.genero !== filters.genero) return false;

    return true;
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todos los perritos</h1>

        <div className={styles.filtersBar}>
          <select
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="todos">Estado</option>
            <option value="En adopción">En adopción</option>
            <option value="En tránsito">En tránsito</option>
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
              setFilters({ estado: "todos", tamanio: "todos", genero: "todos" })
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

export default AllDogs;
