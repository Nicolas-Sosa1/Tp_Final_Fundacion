import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OneDog from "../../components/OneDog";
import axios from "../../../../server/config/Axios"; // ✅ Importar axios configurado

const OneDogAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar animal
  useEffect(() => {
    const fetchDog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/animals/${id}`);
        setData(res.data.animal);
        setError(null);
      } catch (err) {
        console.error("Error cargando perro:", err);
        setError("Error al cargar el animal");
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  // Guardar cambios
  const guardarEnBD = async (nuevo) => {
    try {
      const res = await axios.put(`/api/animals/update/${id}`, nuevo);
      setData(res.data);
      alert("Cambios guardados correctamente");
      return true;
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Error al guardar cambios: " + (err.response?.data?.message || err.message));
      return false;
    }
  };

  // Eliminar (marcar como no disponible)
  const eliminarDeBD = async () => {
    const seguro = window.confirm(
      `¿Marcar a ${data?.nombre} como no disponible? Esta acción se puede revertir editando el animal.`
    );
    if (!seguro) return;

    try {
      await axios.delete(`/api/animals/destroy/${id}`);
      alert("Animal marcado como no disponible");
      navigate("/homeadmin");
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("Error al eliminar: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando perro...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!data) return <div className="text-center mt-5">No se encontró el animal</div>;

  return (
    <OneDog
      data={data}
      onSave={guardarEnBD}
      onDeleteRequest={eliminarDeBD}
      modo="admin"
    />
  );
};

export default OneDogAdmin;