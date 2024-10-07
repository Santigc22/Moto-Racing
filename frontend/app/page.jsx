"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/usuarios/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const responseData = await res.json();
      localStorage.setItem('MOTO_RACING_AUTH_TOKEN', responseData.authorization)
      console.log(responseData);
      alert(responseData["message"]);
    } catch (err) {
      console.error("Error al hacer la solicitud:", err);
    }
  };

  const goToRegisterPage = () => {
    router.push('/registerUser');
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main>

        <form className="position-relative vw-75 overflow-hidden rounded border border-gray-100" onSubmit={validateLogin}>

          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 px-5 py-2 pt-4 text-center">
            <h3 className="h5 text-white text-uppercase font-weight-bold">Inicio de sesión</h3>
            <p className="small text-white-50">Usa tu correo y contraseña para acceder</p>
          </div>

          <div className="d-flex flex-column gap-1 px-5 py-4 px-sm-5">

            <label htmlFor="username_input" className="form-label text-uppercase text-white">Nombre de usuario</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              id="username_input"
              type="text"
              placeholder="user@acme.com"
              required
              className="mt-1 form-control rounded border border-gray-200 shadow-sm text-black"
            />

            <br />

            <label htmlFor="password" className="form-label text-uppercase text-white">Contraseña</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
              className="mt-1 form-control rounded border border-gray-200 shadow-sm text-black"
              type="password"
              name="password"
            />

            <br />

            <button
              type="submit"
              aria-disabled="false"
              className="btn btn-success border border-gray-200 d-flex align-items-center justify-content-center w-100"
              style={{ height: "40px" }}
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
        </form>

      </main>
    </div>
  );
}
