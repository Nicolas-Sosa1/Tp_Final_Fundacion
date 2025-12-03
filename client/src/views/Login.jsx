import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../css/Login.module.css'


const Login = ({setLogin,setMe}) =>{

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
            if (state.email === "lucas.fernandez@test.com") {
                setMe({ role: "admin", email: state.email });
            } else {
                setMe({ role: "user", email: state.email });
            }
                setErrors({})
                navigate('/home')
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
        <form onSubmit={e => loginProcess(e)} className={styles.formContainer}>

                <div className={styles.formGroup}>
                    <h1 className={styles.titulo}>Login</h1>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Correo:</label>
                    <input type="email" name="email" id="email" value={state.email} onChange={(e)=> updateState(e)} className={styles.inputField}/>
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" name="password" id="password" value={state.password} onChange={(e)=> updateState(e)} className={styles.inputField}/>
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>
                
                <div className={styles.formGroup}>
                    <button className={styles.buttonLogin}>Login</button>
                </div>
        </form>

    )
}

export default Login;