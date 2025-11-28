import { useState } from 'react'
import {Routes, Route, Link, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import NewAnimal from './views/NewAnimal'
import UpdateAnimal from './views/UpdateAnimal'



function App() {
    const [listaPerros, setListaPerros] = useState([])
    const [login, setLogin] = useState(false)
    const [me,setMe] = useState({})
    const navigate = useNavigate();

    const logOut = () => {
      localStorage.removeItem("token_user")
      setLogin(false)
      navigate('/login');
    }


  return (

    <>
    <header className="navbar">
      <h1 className="navbar__title">Patitas al rescate</h1>

      <nav className="navbar__links">
        {login ? (
          <>
            <Link to="/home" className="navbar__link">Ser hogar de tránsito</Link>
            <Link to="/home" className="navbar__link">Adoptar</Link>
            <Link to="/home" className="navbar__link">Donar</Link>
            <Link to="/agregarPerro" className="navbar__link">Agregar Animal</Link>
            <button onClick={logOut} className="navbar__button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Login</Link>
            <Link to="/register" className="navbar__link">Registro</Link>
          </>
        )}
      </nav>
    </header>


    

    <main>
      <Routes>
        <Route path='/login' element={<Login setLogin={setLogin} />}/>
        <Route path='/register' element={<Register setLogin={setLogin} />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/agregarPerro' element={<NewAnimal listaPerros={listaPerros} setListaPerros={setListaPerros}/>}/>
        <Route path='/perro/update/:id' element={<UpdateAnimal listaPerros={listaPerros} setListaPerros={setListaPerros} logOut={logOut} setLogin={setLogin}/>}/>
      </Routes>
    </main>

    </>
  )
}

export default App
