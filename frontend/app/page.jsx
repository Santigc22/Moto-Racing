"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const validateLogin = async () => {
    try {
      fetch(`http://localhost:3001/usuarios/getUserLogin`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then((res) => res.json())
        .then((responseData) => {
          console.log(responseData);
          alert(responseData["message"]);
        });
    } catch (err) {
      console.error("Error al hacer la solicitud:", err);
    }
  };

  const goToRegisterPage = () => {
    router.push('/registerUser'); // Navega a la página RegisterUser
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Inicio de sesión</h3>
            <p className="small text-muted">Usa tu correo y contraseña para acceder</p>
          </div>

          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            <label htmlFor="username_input" className="form-label text-uppercase fs- text-muted">Identificacion</label>
            <input
              id="username_input"
              type="number"
              required
              className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm text-gray-200"
              onChange={(e) => setUsername(e.target.value)}
            />
'use client'
import styles from "./page.module.css";
import { useState } from "react";
import VideoBackground from "./Components/VideoBackground";


export default function Home() {

  const [username, setUsername] = useState("");

  const [Password, setPassword] = useState("");

  const UsernameHandler = (e) =>
  {
    setUsername(e);
  }

  const PasswordHandler = (e) =>
  {
    setPassword(e);
  }

  return (

   

    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
       

       <VideoBackground/>
      <main className={styles.main}>

        <form className={`position-relative vw-75 overflow-hidden rounded border border-gray-100 ${styles.customShadow}`}>

        <div className={`d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 px-5 py-2 pt-4 text-center ${styles.customBackground}`}>
          <h3 className="h5 text-white text-uppercase font-weight-bold">Inicio de sesión</h3>
          <p className="small text-white-50">Usa tu correo y contraseña para acceder</p>
        </div>

        <div className={`d-flex flex-column gap-1 px-5 py-4 px-sm-5 ${styles.customBackground}`}>

          <label htmlFor="username_input" className="form-label text-uppercase text-white">Nombre de usuario</label>
          
          <input onChange={(e)=>{UsernameHandler(e.target.value)}} id="username_input" type="text" placeholder="user@acme.com" required 
          className={`mt-1 form-control rounded border border-gray-200 shadow-sm text-black ${styles.customInput}`}
          ></input>

            <br></br>

            <div>
              <label htmlFor="password" className="form-label text-uppercase small text-muted">Contraseña</label>
              <input
                id="password"
                required
                className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          <div>
            <label htmlFor="password" className="form-label text-uppercase text-white">Contraseña</label>
            <input onChange={(e)=>{PasswordHandler(e.target.value)}} id="password" required className={`mt-1 form-control rounded border border-gray-200 text-black shadow-sm ${styles.customInput}`} 
            type="password" name="password"></input>
          </div>

            <br></br>

            <button
              type="submit"
              aria-disabled="false"
              className="btn btn-success border border-gray-200 d-flex align-items-center justify-content-center w-100"
              style={{ height: "40px" }}
              onClick={validateLogin}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              aria-disabled="false"
              className="btn btn-primary border border-gray-200 d-flex align-items-center justify-content-center w-100"
              style={{ height: "40px", marginTop: "20px" }}
              onClick={goToRegisterPage}
            >
              registrarse
            </button>
          </div>
        </div>
          <button type="submit" aria-disabled="false" className={`btn text-uppercase text-white btn-white border border-gray-200 d-flex align-items-center justify-content-center w-100 ${styles.customHoverEffect}`} style={{height: "40px"}}>
            Iniciar sesión
          </button>

          <a></a>

          
        </div>
      </form>


      </main>
    </div>
  );
}
