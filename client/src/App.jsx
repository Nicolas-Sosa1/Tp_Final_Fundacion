import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import NewAnimal from "./views/NewAnimal";
import CorreoArgentino from "./views/CorreoArgentino";
import UpdateAnimal from "./views/UpdateAnimal";
import Donar from "./views/Donar";
import PagosAdmin from "./views/PagosAdmin";
import HomeAdmin from "./views/HomeAdmin";


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
                <NewAnimal
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
            path="/perro/update/:id"
            element={
              login && me.role === "admin" ? (
                <UpdateAnimal
                  listaPerros={listaPerros}
                  setListaPerros={setListaPerros}
                  setLogin={setLogin}
                  logOut={logOut}
                />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route path="/verPerrito" element={<VerPerrito />} />
          <Route
            path="/donaciones"
            element={
              login && me.role === "admin" ? (
                <PagosAdmin />
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          <Route path="/homeadmin" element={<HomeAdmin />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}  
    </>
  );
}

export default App;
