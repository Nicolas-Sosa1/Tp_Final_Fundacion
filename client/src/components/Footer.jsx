import styles from "../css/Footer.module.css";
import { FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className={styles.footer}>

            <div className={styles.topSection}>
                
                <div className={styles.column}>
                    <img 
                        src="/img/logo.png" 
                        alt="Huellas Sin Techo" 
                        className={styles.logo}
                    />
                    <p className={styles.description}>
                        Salvando vidas, una huella a la vez.  
                        Gracias por apoyar nuestra misión.
                    </p>
                </div>

                <div className={styles.column}>
                    <h3>Contacto</h3>
                    <p><FaMapMarkerAlt className={styles.icon}/> Buenos Aires, Argentina</p>
                    <p><FaPhoneAlt className={styles.icon}/> +54 11 2345 6789</p>
                    <p><FaEnvelope className={styles.icon}/> contacto@huellassintecho.org</p>
                </div>

                <div className={styles.column}>
                    <h3>Seguinos</h3>
                    <div className={styles.socials}>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram className={styles.socialIcon}/>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebookF className={styles.socialIcon}/>
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                © {new Date().getFullYear()} Huellas Sin Techo — Todos los derechos reservados.
            </div>

        </footer>
    );
};

export default Footer;
