import { useParams } from "react-router-dom";
import { useState } from "react";
import OneDog from "../../components/OneDog";
import { perros } from "../../data/perros";

const OneDogAdmin = () => {
  const { id } = useParams();
  const perroOriginal = perros.find((p) => p.id === Number(id));

  const [editando, setEditando] = useState(false);
  const [data, setData] = useState(perroOriginal);
  const [tempData, setTempData] = useState(perroOriginal);

  if (!perroOriginal) return <p>Perro no encontrado</p>;

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
        console.log("Guardar en BD:", data);
        setEditando(false);
      }}
      modo="admin"
    />
  );
};

export default OneDogAdmin;
