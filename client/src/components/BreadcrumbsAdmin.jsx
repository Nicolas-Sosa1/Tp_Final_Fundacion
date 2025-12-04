import { Link } from "react-router-dom";
import styles from "../css/Breadcrumbs.module.css";

const BreadcrumbsAdmin = ({ perro, postulacion }) => {
  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/homeadmin" className={styles.link}>
        Home: Ver postulaciones todos los perros
      </Link>

      {perro && (
        <>
          <span> &gt; </span>
          <Link to={`/homeadmin/${perro.id}`} className={styles.link}>
            Ver postulaciones de {perro.nombre}
          </Link>
        </>
      )}

      {postulacion && (
        <>
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
