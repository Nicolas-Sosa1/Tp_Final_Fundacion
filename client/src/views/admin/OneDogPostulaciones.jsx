import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import DogInfoPanel from "../../components/DogInfoPanel";
import PostulantesTabla from "../../components/PostulantesTabla";
import Breadcrumbs from "../../components/BreadcrumbsAdmin";
import styles from "../../css/admin/OneDogPostulaciones.module.css";

const OneDogPostulaciones = () => {
  const { id } = useParams();
  const [perro, setPerro] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token_user");

        // Cargar perro
        const perroRes = await axios.get(
          `http://localhost:8000/api/animals/${id}`,
          { headers: { token_user: token } }
        );

        setPerro(perroRes.data.animal);

        // Cargar postulaciones reales
        const postRes = await axios.get(
          `http://localhost:8000/api/solicitudes/adopcion`,
          { headers: { token_user: token } }
        );

        // Filtrar solo las del perro actual
        const filtrar = postRes.data.filter(
          (s) => s.animal._id === id
        );

        setPostulaciones(filtrar);

      } catch (error) {
        console.log("Error cargando postulaciones:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!perro) return <p>Cargando...</p>;

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
