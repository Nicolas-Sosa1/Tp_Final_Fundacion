import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import OneDog from "../../components/OneDog";
import { perros } from "../../data/perros";

const OneDogAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const perroOriginal = perros.find((p) => p.id === Number(id));

  const [editando, setEditando] = useState(false);
  const [data, setData] = useState(perroOriginal);
  const [tempData, setTempData] = useState(perroOriginal);

  if (!perroOriginal) return <p>Perro no encontrado</p>;

  const guardarEnBD = (nuevo) => {
    console.log("→ Guardando en base de datos...", nuevo);
    // aquí iría tu fetch/axios
  };

  const eliminarDeBD = (id) => {
    console.log("→ Eliminando de la base de datos...", id);
    // fetch/axios aquí
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
      /* NUEVO → cambiar adopción */
      onToggleAdopted={() => {
        const nuevoEstado = { ...data, isAdopted: !data.isAdopted };
        setData(nuevoEstado);
        guardarEnBD(nuevoEstado);
      }}
      /* NUEVO → preguntar antes de eliminar */
      onDeleteRequest={() => {
        const seguro = window.confirm(
          `¿Eliminar a ${data.nombre}? Esta acción no se puede deshacer.`
        );
        if (!seguro) return;

        eliminarDeBD(data.id);
        navigate("/homeadmin");
      }}
      modo="admin"
    />
  );
};

export default OneDogAdmin;
