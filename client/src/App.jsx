import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import './App.css'

import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import NewAnimal from './views/NewAnimal'
import CorreoArgentino from './views/CorreoArgentino'
import UpdateAnimal from './views/UpdateAnimal'
import Donar from './views/Donar';

import NavbarAdmin from './components/NavbarAdmin'
import NavbarPublic from './components/NavbarPublic'
import NavbarUser from './components/NavbarUser'


import VerPerrito from './views/VerPerrito';

function App() {
    const [listaPerros, setListaPerros] = useState([])
    const [login, setLogin] = useState(false)
    const [me, setMe] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token_user");
        if (token) {
            const decoded = jwtDecode(token);
            setMe(decoded);
            setLogin(true);
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem("token_user")
        setLogin(false)
        setMe({})
        navigate('/login');
    }

    return (
        <>
        {login ? (
            <>
            {me.role === "user" && (
                <>
                <NavbarUser logOut={logOut}/>
                </>
            )}

            {me.role === "admin" && (
                <>
                <NavbarAdmin logOut={logOut}/>
                </>
            )}
            </>
        ) : (
            <>
            <NavbarPublic />
            </>
        )}

        <main className='d-flex justify-content-center align-items-center'>

            <Routes>
                <Route path='/login' element={<Login setLogin={setLogin} setMe={setMe} />} />
                <Route path='/register' element={<Register setLogin={setLogin} />} />
                <Route path='/home' element={<Home login={login} me={me} />} />

                <Route path='/donar' element={<Donar />} />
                <Route path='/correo'element={login ? <CorreoArgentino me={me} /> : <Navigate to="/login" />}/>
                <Route path='/agregarPerro'element={login && me.role === "admin"? ( 
                    <NewAnimal listaPerros={listaPerros} setListaPerros={setListaPerros}me={me}logOut={logOut}/>
                    )     : <Navigate to="/home" />}/>
                <Route path='/perro/update/:id'element={login && me.role === "admin"? ( 
                    <UpdateAnimal listaPerros={listaPerros} setListaPerros={setListaPerros} setLogin={setLogin} logOut={logOut}/>
                    )     : <Navigate to="/home" />}/>
                
                <Route path='/verPerrito' element={<VerPerrito />} />
            </Routes>
        </main>
        </>
    )
}

export default App
