import { useParams } from "react-router-dom";
import { perros } from "../../data/perros";
import { postulacionesPorPerro } from "../../data/postulaciones";
import DogInfoPanel from "../../components/DogInfoPanel";
import PostulantesTabla from "../../components/PostulantesTabla";
import styles from "../../css/admin/DogPostulaciones.module.css";

import Breadcrumbs from "../../components/BreadcrumbsAdmin";

const DogPostulacionesPage = () => {
  const { perroId } = useParams();

  const perro = perros.find((p) => p.id === Number(perroId));
  const postulaciones = postulacionesPorPerro[perroId] || [];

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

export default DogPostulacionesPage;
