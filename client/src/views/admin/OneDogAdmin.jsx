import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import OneDog from "../../components/OneDog";

const OneDogAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const token = localStorage.getItem("token_user");
        const res = await axios.get(
          `http://localhost:8000/api/animals/${id}`,
          { headers: { token_user: token } }
        );

        setData(res.data.animal);
        setTempData(res.data.animal);
      } catch (e) {
        console.log("Error cargando perro:", e);
      }
    };

    fetchDog();
  }, [id]);

  if (!data) return <p>Cargando perro...</p>;

  const guardarEnBD = async (nuevo) => {
    try {
      const token = localStorage.getItem("token_user");
      const res = await axios.put(
        `http://localhost:8000/api/animals/update/${id}`,
        nuevo,
        { headers: { token_user: token } }
      );

      alert("Cambios guardados correctamente");
      setData(res.data);
    } catch (e) {
      alert("Error al guardar cambios");
    }
  };


const toggleAdoptado = async () => {
  try {
    const token = localStorage.getItem("token_user");

    const res = await axios.patch(
      `http://localhost:8000/api/animals/adoptado/${id}`,
      {},
      { headers: { token_user: token } }
    );

    alert(res.data.message);
    setData(res.data.animal);

  } catch (e) {
    alert("Error al actualizar estado");
  }
};



  const eliminarPermanentemente = async () => {
    const seguro = window.confirm(
      `⚠ ¿Eliminar DEFINITIVAMENTE a ${data.nombre}? ESTA ACCIÓN NO SE PUEDE DESHACER.`
    );
    if (!seguro) return;

    try {
      const token = localStorage.getItem("token_user");

      await axios.delete(
        `http://localhost:8000/api/animals/delete-permanent/${id}`,
        { headers: { token_user: token } }
      );

      alert("Animal eliminado PERMANENTEMENTE");
      navigate("/homeadmin");
    } catch (e) {
      alert("Error al eliminar definitivamente");
    }
  };

  return (
    <OneDog
      data={data}
      editando={editando}
      onChange={(nuevo) => setData(nuevo)}
      onEditStart={() => {
        setTempData(data);
        setEditando(true);
      }}
      onCancel={() => {
        setData(tempData);
        setEditando(false);
      }}
      onSave={() => {
        guardarEnBD(data);
        setEditando(false);
      }}
      onToggleAdopted={toggleAdoptado}
      onDeleteRequest={eliminarPermanentemente}
      modo="admin"
    />
  );
};

export default OneDogAdmin;
