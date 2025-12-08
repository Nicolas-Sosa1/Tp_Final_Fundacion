import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import UpdateAnimal from "./views/admin/UpdateAnimal.jsx";
// import PagosAdmin from "./views/PagosAdmin";
// import HomeAdmin from "./views/HomeAdmin";

// import Login from "./views/Login";
// import Register from "./views/Register";


// import Home from "./views/user/Home";
import CorreoArgentino from "./views/user/CorreoArgentino";

import AllDogs from "./views/admin/AllDogs.jsx";
import OneDogAdmin from "./views/admin/OneDogAdmin.jsx";
import AllDogsAdoptados from "./views/admin/AllDogsAdoptados.jsx";
import AddDog from "./views/admin/AddDog.jsx";
import AllDogsPostulaciones from "./views/admin/AllDogsPostulaciones.jsx";
import OneDogPostulaciones from "./views/admin/OneDogPostulaciones.jsx";
import OnePostulacion from "./views/admin/OnePostulacion.jsx";

import PagosAdmin from "./views/admin/PagosAdmin";

import NavbarAdmin from "./components/NavbarAdmin";
import NavbarPublic from "./components/NavbarPublic";
import NavbarUser from "./components/NavbarUser";
import Footer from "./components/Footer";

import VerPerrito from "./views/VerPerrito";
import Login_Registro from "./views/Login_Registro";
import OneDog from "./views/OneDog";

import Donaciones from "./views/Donaciones";
import Form from "./views/Form";

function App() {
  const [listaPerros, setListaPerros] = useState([]);
  const [login, setLogin] = useState(false);
  const [me, setMe] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  useEffect(() => {
    const token = localStorage.getItem("token_user");
    if (token) {
      const decoded = jwtDecode(token);
      setMe(decoded);
      setLogin(true);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("token_user");
    setLogin(false);
    setMe({});
    navigate("/login");
  };

  return (
    <>
      {!isLoginPage && (
        <>
          {login ? (
            <>
              {me.role === "user" && <NavbarUser logOut={logOut} />}
              {me.role === "admin" && <NavbarAdmin logOut={logOut} />}
            </>
          ) : (
            <NavbarPublic />
          )}
        </>
      )}
      <main>

        <Routes>
          <Route path="formulario" element={<Form/>}/>
          <Route path="/login" element={<Login_Registro setLogin={setLogin} setMe={setMe} />} />
          {/* <Route path="/login" element={<Login setLogin={setLogin} setMe={setMe} />} />
          <Route path="/register" element={<Register setLogin={setLogin} />} /> */}
          <Route path="/donaciones" element={<Donaciones />} />
          <Route
            path="/correo"
            element={ <CorreoArgentino />}
          />

          <Route
            path="/agregarPerro"
            element={
              login && me.role === "admin" ? (
                <AddDog
                  listaPerros={listaPerros}
                  setListaPerros={setListaPerros}
                  me={me}
                  logOut={logOut}
                />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route path="/oneDog" element={<OneDog />} />
          <Route
            path="/pagos"
            element={
              login && me.role === "admin" ? (
                <PagosAdmin />
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          <Route path="/verPerrito" element={<VerPerrito />} />

          <Route
            path="/homeadmin"
            element={
              // login && me.role === "admin" ? (
              <AllDogs />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* Todos los perritos */}
          <Route
            path="/homeadmin/todos"
            element={
              // login && me.role === "admin" ? (
              <AllDogs />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* Perritos con postulaciones */}
          <Route
            path="/homeadmin/postulaciones"
            element={
              // login && me.role === "admin" ? (
              <AllDogsPostulaciones />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* Perritos adoptados */}
          <Route
            path="/homeadmin/adoptados"
            element={
              // login && me.role === "admin" ? (
              <AllDogsAdoptados />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* Pantalla de un perro individual */}
          <Route
            path="/homeadmin/perro/:id"
            element={
              // login && me.role === "admin" ? (
              <OneDogAdmin />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* OneDogPostulaciones: SOLO para perros con postulaciones */}
          <Route
            path="/homeadmin/perro/:id/postulaciones"
            element={
              // login && me.role === "admin" ? (
              <OneDogPostulaciones />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          {/* Detalle de una postulación */}
          <Route
            path="/homeadmin/perro/:id/postulacion/:postulacionId"
            element={
              // login && me.role === "admin" ? (
              <OnePostulacion />
              // ) : (
              //   <Navigate to="/home" />
              // )
            }
          />

          <Route
            path="/pagos"
            element={
              login && me.role === "admin" ? (
                <PagosAdmin />
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          {/* <Route path="/homeadmin" element={<HomeAdmin />} /> */}
        </Routes>
      </main>
      {!isLoginPage && <Footer />}  
    </>
  );
}

export default App;