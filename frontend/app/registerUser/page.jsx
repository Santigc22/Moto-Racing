"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoIden, setTipoIden] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [fechaNaci, setFechaNaci] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter(); 

  const validarCampos = () => {
    if (
      !nombre ||
      !apellido ||
      !tipoIden ||
      !identificacion ||
      !fechaNaci ||
      !direccion ||
      !telefono ||
      !password
    ) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };


  const registrar = async () => {

    if (!validarCampos()) {
      return;
    }

    try {
      fetch(`http://localhost:3001/usuarios/setUser`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          tipoIden,
          fechaNaci,
          direccion,
          telefono,
          identificacion,
          password
        }),
      })
        .then((res) => res.json())
        .then((responseData) => {
          console.log(responseData);
          alert(responseData);
          setNombre("");
          setApellido("");
          setTipoIden("");
          setIdentificacion("");
          setFechaNaci("");
          setDireccion("");
          setTelefono("");
          setPassword("");
        });
    } catch (err) {
      console.error("Error al hacer la solicitud:", err);
    }
  };



  const goToLogin = () => {
    router.push('/'); // Navega a la página RegisterUser
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Registro de usuario</h3>
          </div>

          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label text-uppercase small text-muted">Nombre (*)</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="last_name" className="form-label text-uppercase small text-muted">Apellido (*)</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="id_type" className="form-label text-uppercase small text-muted">Tipo de Identificación (*)</label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setTipoIden(e.target.value)}
                >
                  <option value=""></option>
                  <option value="1">Cédula de Ciudadanía</option>
                  <option value="2">Cédula de Extranjería</option>
                  <option value="3">Tarjeta de Identidad</option>
                  <option value="4">Pasaporte</option>
                  <option value="5">Registro Civil</option>
                  <option value="6">NIT</option>
                  <option value="7">Permiso Especial de Permanencia</option>
                </select>
              </div>
                <div className="col-md-6">
                  <label htmlFor="identificacion" className="form-label text-uppercase small text-muted">Identificacion (*)</label>
                  <input
                    id="identificacion"
                    type="number"
                    required
                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                    onChange={(e) => setIdentificacion(e.target.value)}
                  />
                </div>
              
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="address" className="form-label text-uppercase small text-muted">Dirección (*)</label>
                <input
                  id="address"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="birth_date" className="form-label text-uppercase small text-muted">Fecha de Nacimiento (*)</label>
                <input
                  id="birth_date"
                  type="date"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setFechaNaci(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label text-uppercase small text-muted">Teléfono (*)</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
                <label htmlFor="password" className="form-label text-uppercase small text-muted">Contraseña (*)</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>


            <div className="row mt-3">
              <div className="col-md-6">
                
              <button
                type="submit"
                aria-disabled="false"
                className="btn btn-success border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                style={{ height: "40px" }}
                onClick={registrar}
              >
                Registrarse
              </button>
              </div>
              <div className="col-md-6">
                
              <button
                type="submit"
                aria-disabled="false"
                className="btn btn-primary border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                style={{ height: "40px" }}
                onClick={goToLogin}
              >
                Volver
              </button>
              </div>
            </div>
            

          </div>
        </div>

      </main>
    </div>
  );
}
