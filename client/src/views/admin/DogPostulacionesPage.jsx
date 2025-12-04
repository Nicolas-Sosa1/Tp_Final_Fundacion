import { useParams } from "react-router-dom";
import { perros } from "../../data/perros";
import { postulacionesPorPerro } from "../../data/postulaciones";
import DogInfoPanel from "../../components/DogInfoPanel";
import PostulantesTabla from "../../components/PostulantesTabla";
import styles from "../../css/admin/DogPostulacionesPage.module.css";

const DogPostulacionesPage = () => {
  const { perroId } = useParams();

  const perro = perros.find((p) => p.id === Number(perroId));
  const postulaciones = postulacionesPorPerro[perroId] || [];

  if (!perro) {
    return <p>Perro no encontrado</p>;
  }

  return (
    <main className={styles.page}>
      <DogInfoPanel perro={perro} />
      <PostulantesTabla postulaciones={postulaciones} />
    </main>
  );
};

export default DogPostulacionesPage;
