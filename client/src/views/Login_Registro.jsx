import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importar jwtDecode
import styles from "../css/Login_Registro.module.css";

const Login = ({ setLogin, setMe }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const loginProcess = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/users/login", loginData)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token_user", token);

        // Decodificar token para obtener info del usuario
        const decoded = jwtDecode(token);

        setLogin(true);
        setMe({
          role: decoded.role,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          id: decoded.id,
        });
        setErrors({});
        navigate("/home");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setErrors(
          err.response?.data?.errors || { general: "Error en el login" }
        );
      });
  };

  const registerUser = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/users/register", registerData)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token_user", token);

        // También decodificar el token después del registro
        const decoded = jwtDecode(token);

        setLogin(true);
        setMe({
          role: decoded.role,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          id: decoded.id,
        });
        setErrors({});
        navigate("/home");
      })
      .catch((err) => {
        console.error("Register error:", err);
        setErrors(
          err.response?.data?.errors || { general: "Error en el registro" }
        );
      });
  };

  return (
    <div
      className={`${styles.container} ${isRegistering ? styles.active : ""}`}
    >
      <div className={`${styles.form_container} ${styles.sign_in}`}>
        <form onSubmit={loginProcess} className="gap-3">
          <h2 className="title_orange mb-3">Iniciar sesión</h2>

          {/* Mostrar error general si existe */}
          {errors.general && (
            <p className={styles.errorText}>{errors.general}</p>
          )}

          <div className="d-flex relative w-50 ">
            <i className={`fa-solid fa-user orange ${styles.icons}`}></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="background-transparent-orange text-orange font-400 font-15 rounded border-orange px-5 w-full"
            />
          </div>

          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          <div className="d-flex relative w-50 ">
            <i className={`fa-solid fa-lock orange ${styles.icons}`}></i>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={loginData.password}
              onChange={handleLoginChange}
              className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-5 w-full"
            />
          </div>

          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
          <button className="btn btn_navbar mb-3" type="submit">
            Iniciar sesión
          </button>

          <p className={styles.switch_link}>
            ¿Ya tenés cuenta?
            <span
              className={styles.switch_span}
              onClick={() => setIsRegistering(true)}
            >
              Registrate
            </span>
          </p>
        </form>
      </div>

      <div className={`${styles.form_container} ${styles.sign_up}`}>
        <form onSubmit={registerUser}>
          <h2 className="title_orange mb-5">Registrarme</h2>

          {/* Mostrar error general si existe */}
          {errors.general && (
            <p className={styles.errorText}>{errors.general}</p>
          )}

          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={registerData.firstName}
            onChange={handleRegisterChange}
            className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-3 w-50"
          />
          {errors.firstName && (
            <p className={styles.errorText}>{errors.firstName}</p>
          )}

          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={registerData.lastName}
            onChange={handleRegisterChange}
            className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-3 w-50"
          />
          {errors.lastName && (
            <p className={styles.errorText}>{errors.lastName}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-3 w-50"
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={registerData.password}
            onChange={handleRegisterChange}
            className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-3 w-50"
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}

          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirmar contraseña"
            value={registerData.passwordConfirmation}
            onChange={handleRegisterChange}
            className="background-transparent-orange text-orange  font-400 font-15 rounded border-orange px-3 w-50"
          />
          {errors.passwordConfirmation && (
            <p className={styles.errorText}>{errors.passwordConfirmation}</p>
          )}

          <button className="btn btn_navbar mb-3" type="submit">
            Registrarse
          </button>
          <p className={styles.switch_link}>
            ¿Ya tenés cuenta?
            <span
              className={styles.switch_span}
              onClick={() => setIsRegistering(false)}
            >
              Iniciar sesión
            </span>
          </p>
        </form>
      </div>
      <div className={styles.toggle_container}>
        <div className={styles.toggle}>
          <div className={`${styles.toggle_panel} ${styles.toggle_left}`}>
            <h1 className="text-white title_orange ">
              Bienvenido a Huellas Sin Techo
            </h1>
            <p className="font-20 mt-3 text-white ">
              Tus amigos peludos te extrañan, conéctate y sigue cambiando vidas.
            </p>
            <button
              className={styles.hidden}
              onClick={() => setIsRegistering(false)}
            >
              Iniciar sesión
            </button>
          </div>

          <div className={`${styles.toggle_panel} ${styles.toggle_right}`}>
            <h1 className="text-white title_orange ">¡Bienvenido de vuelta!</h1>
            <p className="font-20 mt-3 text-white ">
              Tu mejor amigo peludo te espera. ¡Solo tenes que registrarte!
            </p>
            <button
              className={styles.hidden}
              onClick={() => setIsRegistering(true)}
            >
              Registrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
