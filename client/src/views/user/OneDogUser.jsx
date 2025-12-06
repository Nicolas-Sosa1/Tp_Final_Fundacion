import { useParams } from "react-router-dom";
import OneDog from "../../components/OneDog";
import { perros } from "../../data/perros";

const OneDogUser = () => {
  const { id } = useParams();
  const perro = perros.find((p) => p.id === Number(id));

  if (!perro) return <p>Perro no encontrado</p>;

  return <OneDog data={perro} modo="user" />;
};

export default OneDogUser;
