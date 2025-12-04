import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../css/Register.module.css'

const Register = ({ setLogin }) => {
    const navigate = useNavigate();

    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });

    const [errors, setErrors] = useState({});

    const updateState = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const registerUser = (e) => {
        e.preventDefault();
        const URL = 'http://localhost:8000/api/users/register';
        axios.post(URL, state)
        .then(response => {
            localStorage.setItem("token_user", response.data.token);
            setLogin(true);
            setErrors({});
            navigate("/homeuser");
        })
        .catch(e => setErrors(e.response?.data?.errors || {}));
    };

    return (
        <div className={styles.registerWrapper}>
            <form onSubmit={registerUser} className={styles.registerCard}>

                <h1 className={styles.title}>Crear cuenta</h1>

                <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input type="text" name="firstName" value={state.firstName} onChange={updateState} className={styles.inputField}/>
                    {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Apellido</label>
                    <input type="text" name="lastName" value={state.lastName} onChange={updateState}className={styles.inputField}/>
                    {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" name="email" value={state.email} onChange={updateState} className={styles.inputField}/>
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Contraseña</label>
                    <input type="password" name="password" value={state.password} onChange={updateState} className={styles.inputField}/>
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Confirmar contraseña</label>
                    <input type="password" name="passwordConfirmation" value={state.passwordConfirmation} onChange={updateState} className={styles.inputField}/>
                    {errors.passwordConfirmation && <p className={styles.errorText}>{errors.passwordConfirmation}</p>}
                </div>

                <button className={styles.buttonRegistrar}>Registrarse</button>

            </form>
        </div>
    );
};

export default Register;
