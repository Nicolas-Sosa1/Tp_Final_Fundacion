import { Link,NavLink } from "react-router-dom";
import styles from "../css/NavBar.module.css";

const NavbarAdmin = ({ logOut }) =>{
  return (
      <nav className={`d-flex justify-content-between align-items-center px-5 pt-3 pb-3 mt-3 shadow-bottom ${styles.height_navbar}`}>  
        <div className="d-flex align-items-center">
            <div className={styles.contenedor_img}>
                <img src="../img/logo.png" alt="logo" />
            </div>
            <p className="title_orange font_title mr-5 mb-0">Huellas Sin Techo</p>
        </div>

        <div className="d-flex align-items-center justify-content-between w-50">
          <NavLink to="/homeadmin"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Panel Admin</NavLink>
          <NavLink to="/agregarPerro"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Agregar perrito</NavLink>
          <NavLink to="/homeadmin/postulaciones"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Postulaciones</NavLink>
          <NavLink to="/homeadmin/adoptados"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Adoptados</NavLink>
          <NavLink to="/actividades"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Actividades</NavLink>
          <NavLink to="/donaciones"className={({ isActive }) => isActive ? "text-decoration-none text-black-title font_sm navlink navlink_active": "text-decoration-none text-black-title font_sm navlink"}>Donaciones</NavLink>

          <Link to="/home" onClick={logOut}><i className="fa-solid fa-arrow-right-from-bracket icon_20 text-black-title"></i></Link>
        </div>
      </nav>
  );
}

export default NavbarAdmin;