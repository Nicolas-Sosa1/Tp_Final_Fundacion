import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import DogInfoPanel from "../../components/DogInfoPanel";
import PostulantesTabla from "../../components/PostulantesTabla";
import Breadcrumbs from "../../components/BreadcrumbsAdmin";
import styles from "../../css/admin/OneDogPostulaciones.module.css";
import axios from "../../../../server/config/Axios"; // ✅ Importar axios configurado

const OneDogPostulaciones = () => {
  const { id } = useParams();
  const [perro, setPerro] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar perro
        const perroRes = await axios.get(`/api/animals/${id}`);
        setPerro(perroRes.data.animal);

        // Cargar postulaciones
        const postRes = await axios.get("/api/solicitudes/adopcion");
        
        // Filtrar solo las del perro actual
        const filtrar = postRes.data.filter(
          (s) => s.animal && s.animal._id === id
        );

        setPostulaciones(filtrar);
        setError(null);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
        setError("Error al cargar las postulaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Cargando...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!perro) return <p className="text-center mt-5">No se encontró el perro</p>;

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