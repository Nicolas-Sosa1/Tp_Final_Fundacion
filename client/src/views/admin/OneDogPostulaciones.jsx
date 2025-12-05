import { useParams } from "react-router-dom";
import { perros } from "../../data/perros";
import { postulacionesPorPerro } from "../../data/postulaciones";
import DogInfoPanel from "../../components/DogInfoPanel";
import PostulantesTabla from "../../components/PostulantesTabla";
import styles from "../../css/admin/OneDogPostulaciones.module.css";
import Breadcrumbs from "../../components/BreadcrumbsAdmin";

const OneDogPostulaciones = () => {
  const { id } = useParams(); // ← ESTA ES LA CLAVE

  const perro = perros.find((p) => p.id === Number(id));
  const postulaciones = postulacionesPorPerro[id] || [];

  if (!perro) {
    return <p>Perro no encontrado</p>;
  }

  return (
    <main className={styles.page}>
      <Breadcrumbs perro={perro} />
      <div className={styles.body}>
        <DogInfoPanel perro={perro} />
        <PostulantesTabla postulaciones={postulaciones} />
      </div>
    </main>
  );
};

export default OneDogPostulaciones;
