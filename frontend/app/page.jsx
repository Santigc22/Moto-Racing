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

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Inicio de sesión</h3>
            <p className="small text-muted">Usa tu correo y contraseña para acceder</p>
          </div>

          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            <label htmlFor="username_input" className="form-label text-uppercase fs- text-muted">Nombre de usuario</label>
            <input
              id="username_input"
              type="text"
              placeholder="user@acme.com"
              required
              className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm text-gray-200"
              onChange={(e) => setUsername(e.target.value)}
            />

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
            >
              registrarse
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
