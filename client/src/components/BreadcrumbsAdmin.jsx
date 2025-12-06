import { Link, useLocation } from "react-router-dom";
import styles from "../css/Breadcrumbs.module.css";

const BreadcrumbsAdmin = ({ perro, postulacion }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className={styles.breadcrumbs}>
      {/* Home */}
      <Link to="/homeadmin" className={styles.link}>
        Home Admin
      </Link>

      {/* TODOS LOS PERROS */}
      {path.includes("/todos") && (
        <>
          <span> &gt; </span>
          <span className={styles.current}>Todos los perros</span>
        </>
      )}

      {/* PERRITOS CON POSTULACIONES */}
      {path.includes("/postulaciones") && !perro && (
        <>
          <span> &gt; </span>
          <span className={styles.current}>Perritos con postulaciones</span>
        </>
      )}

      {/* PERRITOS ADOPTADOS */}
      {path.includes("/adoptados") && (
        <>
          <span> &gt; </span>
          <span className={styles.current}>Perritos adoptados</span>
        </>
      )}

      {/* UN PERRO INDIVIDUAL */}
      {perro && (
        <>
          <span> &gt; </span>
          <Link to={`/homeadmin/perro/${perro.id}`} className={styles.link}>
            {perro.nombre}
          </Link>
        </>
      )}

      {/* POSTULACIONES DE UN PERRO */}
      {path.includes("/postulaciones") && perro && !postulacion && (
        <>
          <span> &gt; </span>
          <span className={styles.current}>
            Postulaciones de {perro.nombre}
          </span>
        </>
      )}

      {/* UNA POSTULACION ESPECÍFICA */}
      {postulacion && perro && (
        <>
          <span> &gt; </span>
          <Link
            to={`/homeadmin/perro/${perro.id}/postulaciones`}
            className={styles.link}
          >
            Postulaciones de {perro.nombre}
          </Link>

          <span> &gt; </span>
          <span className={styles.current}>
            Postulación de {postulacion.respuestas?.[3]}
          </span>
        </>
      )}
    </nav>
  );
};

export default BreadcrumbsAdmin;
