import { useState, useEffect } from "react";
import axios from "axios";
import DogGrid from "../../components/DogGrid";

const AllDogsUser = () => {
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipoIngreso: "todos",
    tamaño: "todos",
    sexo: "todos",
    edad: "todos",
  });

  const fetchPerros = async () => {
    try {
      setLoading(true);
      const resAdopcion = await axios.get(
        "http://localhost:8000/api/animals/public/adopcion"
      );
      const resTransito = await axios.get(
        "http://localhost:8000/api/animals/public/transito"
      );
      setPerros([...resAdopcion.data, ...resTransito.data]);
      setLoading(false);
    } catch (e) {
      console.error("Error cargando animales:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerros();
  }, []);

  const filteredPerros = perros.filter((p) => {
    if (
      filters.tipoIngreso !== "todos" &&
      p.tipoIngreso !== filters.tipoIngreso
    )
      return false;
    if (filters.tamaño !== "todos" && p.tamaño !== filters.tamaño) return false;
    if (filters.sexo !== "todos" && p.sexo !== filters.sexo) return false;
    if (filters.edad !== "todos") {
      const age = Number(p.edad);
      if (filters.edad === "cachorro" && age > 2) return false;
      if (filters.edad === "adulto" && (age <= 2 || age > 7)) return false;
      if (filters.edad === "mayor" && age <= 7) return false;
    }
    return true;
  });

  const getDogLink = (perro) => `/animales/${perro._id}`;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Nuestros animales</h1>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            value={filters.tipoIngreso}
            onChange={(e) =>
              setFilters({ ...filters, tipoIngreso: e.target.value })
            }
            className="form-select"
          >
            <option value="todos">Tipo</option>
            <option value="adopcion">Adopción</option>
            <option value="transito">Tránsito</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            value={filters.tamaño}
            onChange={(e) => setFilters({ ...filters, tamaño: e.target.value })}
            className="form-select"
          >
            <option value="todos">Tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            value={filters.sexo}
            onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
            className="form-select"
          >
            <option value="todos">Sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            value={filters.edad}
            onChange={(e) => setFilters({ ...filters, edad: e.target.value })}
            className="form-select"
          >
            <option value="todos">Edad</option>
            <option value="cachorro">Cachorro (0-2)</option>
            <option value="adulto">Adulto (3-7)</option>
            <option value="mayor">Mayor (+7)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DogGrid perros={filteredPerros} getLink={getDogLink} />
      )}
    </div>
  );
};

export default AllDogsUser;
