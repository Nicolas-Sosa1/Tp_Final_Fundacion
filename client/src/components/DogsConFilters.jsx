import { useState, useEffect } from "react";
import axios from "axios";
import DogGrid from "./DogGrid";
import styles from "../css/DogsConFilters.module.css";

const DogsConFilters = ({ defaultFilters = {}, context = "todos" }) => {
  const [perros, setPerros] = useState([]);

  const [filters, setFilters] = useState({
    tipoIngreso: defaultFilters.tipoIngreso || "todos",
    estado:
      context === "adoptados" ? "adoptado" : defaultFilters.estado || "todos",
    tamaño: "todos",
    sexo: "todos",
  });

  const getDogLink = (perro) => {
    if (context === "postulaciones") {
      return `/homeadmin/perro/${perro._id}/postulaciones`;
    }
    if (filters.estado === "conPostulaciones") {
      return `/homeadmin/perro/${perro._id}/postulaciones`;
    }
    if (context === "user") {
      return `/animales/${perro._id}`;
    }
    return `/homeadmin/perro/${perro._id}`;
  };

  useEffect(() => {
    const fetchPerros = async () => {
      try {
        let lista = [];
        if (context === "user") {
          try {
            const res = await axios.get(
              "http://localhost:8000/api/animals/public/all"
            );
            lista = res.data.filter((p) => p.estadoGeneral === true);
          } catch (e) {
            console.log(e);
            const adopcion = await axios.get(
              "http://localhost:8000/api/animals/public/adopcion"
            );
            const transito = await axios.get(
              "http://localhost:8000/api/animals/public/transito"
            );
            lista = [...adopcion.data, ...transito.data].filter(
              (p) => p.estadoGeneral === true
            );
          }
        } else {
          // Admin/postulaciones/adoptados...
          const adopcion = await axios.get(
            "http://localhost:8000/api/animals/public/adopcion"
          );
          const transito = await axios.get(
            "http://localhost:8000/api/animals/public/transito"
          );
          lista = [...adopcion.data, ...transito.data];
          if (context === "adoptados") {
            const adopcionBaja = await axios.get(
              "http://localhost:8000/api/animals/public/adopcion/baja"
            );
            const transitoBaja = await axios.get(
              "http://localhost:8000/api/animals/public/transito/baja"
            );
            lista = [...adopcionBaja.data, ...transitoBaja.data];
          }
          const solicitudesRes = await axios.get(
            "http://localhost:8000/api/solicitudes/adopcion",
            { headers: { token_user: localStorage.getItem("token_user") } }
          );
          const mapPost = {};
          solicitudesRes.data.forEach((s) => {
            const id = s.animal?._id;
            if (!id) return;
            mapPost[id] = (mapPost[id] || 0) + 1;
          });
          lista = lista.map((p) => ({
            ...p,
            postulaciones: mapPost[p._id] || 0,
          }));
          if (context === "todos" && filters.estado === "adoptado") {
            const adopcionBaja = await axios.get(
              "http://localhost:8000/api/animals/public/adopcion/baja"
            );
            const transitoBaja = await axios.get(
              "http://localhost:8000/api/animals/public/transito/baja"
            );
            lista = [...adopcionBaja.data, ...transitoBaja.data].map((p) => ({
              ...p,
              postulaciones: mapPost[p._id] || 0,
            }));
          }
        }
        setPerros(lista);
      } catch (e) {
        console.log("Error cargando perros:", e);
      }
    };
    fetchPerros();
    // Para user, el filtro estado no afecta el fetch
  }, [context, context === "user" ? undefined : filters.estado]);

  const perrosFiltrados = perros.filter((p) => {
    if (context !== "user" && filters.estado !== "todos") {
      if (filters.estado === "conPostulaciones" && p.postulaciones === 0)
        return false;
      if (filters.estado === "sinPostulaciones" && p.postulaciones > 0)
        return false;
      if (filters.estado === "adoptado" && p.estadoGeneral !== false)
        return false;
      if (
        filters.estado === "conTransito" &&
        !(p.estadoGeneral === false && p.tipoIngreso === "transito")
      )
        return false;
    }
    if (
      filters.tipoIngreso !== "todos" &&
      p.tipoIngreso !== filters.tipoIngreso
    )
      return false;
    if (filters.tamaño !== "todos" && p.tamaño !== filters.tamaño) return false;
    if (filters.sexo !== "todos" && p.sexo !== filters.sexo) return false;
    return true;
  });

  const getDynamicTitle = () => {
    if (context === "adoptados") return "adoptados";
    switch (filters.estado) {
      case "conPostulaciones":
        return "con postulaciones";
      case "sinPostulaciones":
        return "sin postulaciones";
      case "adoptado":
        return "adoptados";
      case "conTransito":
        return "en tránsito";
      default:
        return "";
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {context === "user"
            ? "Perritos en adopción"
            : context === "postulaciones"
            ? "Perritos con postulaciones"
            : "Todos los perritos"}{" "}
          {context !== "user" && getDynamicTitle() && (
            <span className={styles.highlight}>{getDynamicTitle()}</span>
          )}
        </h1>
        {/* FILTROS */}
        <div className={styles.filtersBar}>
          {context !== "user" && (
            <select
              value={filters.estado}
              onChange={(e) =>
                setFilters({ ...filters, estado: e.target.value })
              }
            >
              <option value="todos">Estado</option>
              <option value="conPostulaciones">Con postulaciones</option>
              <option value="sinPostulaciones">Sin postulaciones</option>
              <option value="adoptado">Ya fue adoptado</option>
              <option value="conTransito">Ya tiene tránsito</option>
            </select>
          )}
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
          <select
            value={filters.tamaño}
            onChange={(e) => setFilters({ ...filters, tamaño: e.target.value })}
          >
            <option value="todos">Tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
          <select
            value={filters.sexo}
            onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
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
                estado: context !== "user" ? "todos" : undefined,
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
