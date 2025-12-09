import { Link, NavLink } from "react-router-dom";
import styles from "../css/NavBar.module.css";

const NavbarPublic = () => {
  return (
    <nav
      className={`d-flex justify-content-between align-items-center px-5 pt-3 pb-3 mt-3 shadow-bottom ${styles.height_navbar}`}
    >
      <div className="d-flex align-items-center">
        <div className={styles.contenedor_img}>
          <img src="../../img/logo.png" alt="logo" />
        </div>
        <p className="title_orange font_title mr-5 mb-0">Huellas Sin Techo</p>
      </div>

      <div className="d-flex align-items-center justify-content-between w-50">
        {/* Solo opciones esenciales para público */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none text-black-title font_sm navlink navlink_active"
              : "text-decoration-none text-black-title font_sm navlink"
          }
        >
          Inicio
        </NavLink>
        
        <NavLink
          to="/donaciones"
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none text-black-title font_sm navlink navlink_active"
              : "text-decoration-none text-black-title font_sm navlink"
          }
        >
          Donar
        </NavLink>

        {/* Acción principal para público: Login */}
        <Link
          className="text-decoration-none text-black-title font_sm"
          to="/login"
        >
          Ingresar / Registrarse
        </Link>
        
        {/* Botón de adopción redirige a login */}
        <Link to="/login" className="text-decoration-none">  
          <button className="btn_navbar rounded-3 pad-10">
            ¡Quiero Adoptar!
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarPublic;