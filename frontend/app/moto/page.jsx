"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [idMoto, setIdMoto] = useState("");
    const [pilotoId, setPilotoId] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [soat, setSoat] = useState("");
    const [pilotos, setPilotos] = useState([]);
    const [motos, setMotos] = useState([]);
    const [estadoAct, setIEstadoActu] = useState(false);
    const [estadoRe, setIEstadoRegi] = useState(true);

    const setPiloto = () => {
        try {
            fetch(`http://localhost:3001/motos/getPilotos/`)
            .then((res) => res.json())
            .then((data) => {
                setPilotos(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    
    const getMotos = () => {
        try {
            fetch(`http://localhost:3001/motos/getMotos/`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.response);
                setMotos(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const validarCampos = () => {
        if (!pilotoId || !marca || !modelo || !soat) {
            alert("Todos los campos son obligatorios.");
        return false;
        }
        return true;
    };

    const insertMoto = async () => {
        if (!validarCampos()) {
            return;
        }

        try {
        fetch(`http://localhost:3001/motos/setMotos`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pilotoId,
                marca,
                modelo,
                soat
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            console.log(responseData);
            alert(responseData["message"]);

            setPilotoId("");
            setMarca("");
            setModelo("");
            setSoat("");
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };


    const searchMoto = async (id) => {
        try {
        fetch(`http://localhost:3001/motos/motoId`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            
            setIdMoto(responseData.response[0]['id'])
            setPilotoId(responseData.response[0]['propietario_id']);
            setMarca(responseData.response[0]['marca']);
            setModelo(responseData.response[0]['modelo']);
            setSoat(responseData.response[0]['soat']);
            setIEstadoActu(true); 
            setIEstadoRegi(false);
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };


    const updateMoto = async (id) => {
      try {
        fetch(`http://localhost:3001/motos/updateMoto`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idMoto,
              pilotoId,
              marca,
              modelo,
              soat
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
              alert(responseData["message"]);
              setIEstadoRegi(true);
            
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };


    const inactivarMoto = async (id) => {

        const confirmacion = window.confirm(`¿Estás seguro de que deseas Inactivar ?`);

        if (confirmacion) {
            fetch(`http://localhost:3001/motos/updateEstado/${id}`, {
                method: 'POST'
            })
                .then(res => res.json())
                .then(responseData => {
                    alert(responseData["message"]);
                });
        } else {
            console.log(`No se realizó la Inactivacion.`);
        }
    };


    useEffect(() => {
        setPiloto();
        getMotos();
    }, []);


  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Registro de motos</h3>
          </div>
          <input
                  id="id_resgistro"
                  type="hidden"
                  value={idMoto}
                />
          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            <div className="row">
              <div className="col-md-12">
                <label
                  htmlFor="first_name"
                  className="form-label text-uppercase small text-muted"
                >
                  Piloto (*)
                </label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  value={pilotoId}
                  onChange={(e) => setPilotoId(e.target.value)}
                > 
                <option value=""></option>
                {pilotos.map((dato) => (
                    <option key={dato.id} value={dato.id}>
                {dato.nombre}
              </option>
            ))}
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label
                  htmlFor="marca"
                  className="form-label text-uppercase small text-muted"
                >
                  Marca (*)
                </label>
                <input
                  id="marca"
                  type="text"
                  required
                  value={marca}
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setMarca(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="modelo"
                  className="form-label text-uppercase small text-muted"
                >
                  Modelo (*)
                </label>
                <input
                  id="modelo"
                  type="number"
                  required
                  value={modelo}
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setModelo(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label
                  htmlFor="soat"
                  className="form-label text-uppercase small text-muted"
                >
                  Soat (*)
                </label>
                <input
                  id="soat"
                  type="text"
                  required
                  value={soat}
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setSoat(e.target.value)}
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
                  onClick={insertMoto}
                  disabled={!estadoRe}
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
                  onClick={updateMoto}
                  disabled={!estadoAct}
                >
                  Actualizar
                </button>
              </div>
            </div>
            

            {/* Tabla para mostrar las motos registradas */}
            <div className="row mt-5">
              <div className="col-md-12">
                <h5>Motos Registradas</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Piloto</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>SOAT</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                  {motos.map((dato, index) => (
                     <tr key={index}>
                     <td>{dato.nombre}</td>
                     <td>{dato.marca}</td>
                     <td>{dato.modelo}</td>
                     <td>{dato.soat}</td>
                     <td style={{width:'200px'}}>
                         <button className="btn btn-warning btn-sm me-2" onClick={() => searchMoto(dato.id)} id='btn_eliminar'>Actualizar</button>
                         <button className="btn btn-danger btn-sm" onClick={() => inactivarMoto(dato.id)} id='btn_eliminar'>Inactivar</button>
                     </td>
                 </tr>
                    ))}
                      
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
