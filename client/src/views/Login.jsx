import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../css/Login.module.css'
import { jwtDecode } from "jwt-decode"; 


const Login = ({setLogin, setMe}) =>{

    const navigate = useNavigate();

    const [state, setState] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    

    const updateState = (e)=>{
        setState({...state, [e.target.name] : e.target.value})
    }

    const loginProcess = (e)=>{
        e.preventDefault()
        const URL = 'http://localhost:8000/api/users/login'
        axios.post(URL, state).then(
            response =>{
                localStorage.setItem("token_user", response.data.token)
                setLogin(true)
                setErrors({})
                const decoded = jwtDecode(response.data.token);
                setMe(decoded);
                navigate("/home");
            }

        ).catch((e) => {
            if (e.response?.data?.errors) {
                setErrors(e.response.data.errors);
            } else {
                console.log("Error al iniciar sesión");
            }
        });
    }
    return (
        <div className={styles.loginWrapper}>
            <form onSubmit={loginProcess} className={styles.loginCard}>

                <h1 className={styles.title}>Iniciar sesión</h1>

                <div className={styles.formGroup}>
                    <label>Correo</label>
                    <input type="email" name="email" value={state.email} onChange={updateState} className={styles.inputField}/>
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Contraseña</label>
                    <input type="password" name="password" value={state.password} onChange={updateState} className={styles.inputField}/>
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>

                <button className={styles.buttonLogin}>Ingresar</button>
        </form>
    </div>
    );
};

export default Login;