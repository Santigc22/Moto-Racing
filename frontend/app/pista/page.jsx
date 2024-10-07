"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [idPista, setIdPista] = useState("");
    const [nombre, setnombre] = useState("");
    const [terrenoId, setTerrenoId] = useState("");
    const [paisId, setPaisId] = useState("");
    const [departamentoId, setDepartamentoId] = useState("");
    const [ciudadId, setCiudadId] = useState("");

    const [terreno, setTerreno] = useState([]);
    const [pais, setPais] = useState([]);
    const [departamento, setDepartamento] = useState([]);
    const [ciudad, setCiudad] = useState([]);
    const [pista, setPista] = useState([]);

    const [estadoAct, setIEstadoActu] = useState(false);
    const [estadoRe, setIEstadoRegi] = useState(true);




    //muestra los terrenos
    const gerTerreno = () => {
        try {
            fetch(`http://localhost:8080/pista/getTerreno/`)
            .then((res) => res.json())
            .then((data) => {
                setTerreno(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    //muestra los paises
    const getPais = () => {
        try {
            fetch(`http://localhost:8080/pista/getPais/`)
            .then((res) => res.json())
            .then((data) => {
                setPais(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    //departamento por pais
    const getDepartamento = (selectedPaisId) => {
        try {
            fetch(`http://localhost:8080/pista/getDepartamento/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                selectedPaisId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setDepartamento(data.response);            
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    //ciudad por pais
    const getCiudad = (selectedDepaId) => {
        try {
            fetch(`http://localhost:8080/pista/getCiudad/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                selectedDepaId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCiudad(data.response);            
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };


    const validarCampos = () => {
        if (!nombre || !terrenoId || !paisId || !departamento || !ciudadId) {
            alert("Todos los campos son obligatorios.");
        return false;
        }
        return true;
    };

    const insertPista = async () => {
        if (!validarCampos()) {
            return;
        }

        try {
        fetch(`http://localhost:8080/pista/setPista`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                terrenoId,
                paisId,
                departamentoId,
                ciudadId
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            alert(responseData["message"]);

            setnombre("");
            setTerrenoId(null);
            setPaisId(null);
            setDepartamentoId(null);
            setCiudadId(null);
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };


    const updatePista = async () => {

        try {
        fetch(`http://localhost:8080/pista/updatePista`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idPista,
                nombre,
                terrenoId,
                paisId,
                departamentoId,
                ciudadId
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            alert(responseData["message"]);

            setnombre("");
            setTerrenoId(null);
            setPaisId(null);
            setDepartamentoId(null);
            setCiudadId(null);
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };
    
    
    const getPistas = () => {
        try {
            fetch(`http://localhost:8080/pista/getPista/`)
            .then((res) => res.json())
            .then((data) => {
                setPista(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const searchPista = async (id) => {
        try {
        fetch(`http://localhost:8080/pista/pistaId`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
                getDepartamento(responseData.response[0]['id_pais']);
                getCiudad(responseData.response[0]['id_departamento']);

                
                setIdPista(responseData.response[0]['id_pista'])
                setnombre(responseData.response[0]['nombre'])
                setTerrenoId(responseData.response[0]['id_terreno'])
                setPaisId(responseData.response[0]['id_pais'])
                setDepartamentoId(responseData.response[0]['id_departamento'])
                setCiudadId(responseData.response[0]['id_ciudad'])

                setIEstadoActu(true); 
                setIEstadoRegi(false);
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };  

    const eliminarPista = async (id) => {

        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar ?`);

        if (confirmacion) {
            fetch(`http://localhost:8080/pista/deletePista/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(responseData => {
                    alert(responseData["message"]);
                });
        } else {
            console.log(`No se realizó la eliminación.`);
        }
    };


    useEffect(() => {
        gerTerreno();
        getPais();
        getPistas();
    }, []);


  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Registro de Pista</h3>
          </div>
          <input
                  id="id_resgistro"
                  type="hidden"
                  value={idPista}
                />
          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            <div className="row">
              <div className="col-md-12">
                <label
                  htmlFor="first_name"
                  className="form-label text-uppercase small text-muted"
                >
                  Nombre de la pista (*)
                </label>
                <input
                  id="modelo"
                  type="text"
                  required
                  value={nombre}
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setnombre(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label
                  htmlFor="marca"
                  className="form-label text-uppercase small text-muted"
                >
                  Terreno (*)
                </label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  value={terrenoId}
                  onChange={(e) => setTerrenoId(e.target.value)}
                > 
                <option value=""></option>
                {terreno.map((dato,key) => (
                    <option key={key} value={dato.id_terreno}>
                            {dato.nombre}
              </option>
            ))}
                </select>
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="modelo"
                  className="form-label text-uppercase small text-muted"
                >
                  Pais (*)
                </label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  value={paisId}
                  onChange={(e) => {
                    const selectedPaisId = e.target.value;
                    setPaisId(selectedPaisId);
                    getDepartamento(selectedPaisId);
                  }}
                > 
                <option value=""></option>
                    {pais.map((dato,key) => (
                        <option key={key} value={dato.id_pais}>
                    {dato.nombre}
                </option>
                ))}
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label
                  htmlFor="departamento"
                  className="form-label text-uppercase small text-muted"
                >
                  Departamento (*)
                </label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  value={departamentoId}
                  onChange={(e) => {
                    const selectedDepaId = e.target.value;
                    setDepartamentoId(selectedDepaId);
                    getCiudad(selectedDepaId);
                  }}
                > 
                <option value=""></option>
                    {departamento.map((dato,key) => (
                        <option key={key} value={dato.id_departamento}>
                    {dato.nombre}
                </option>
                ))}
                </select>
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="soat"
                  className="form-label text-uppercase small text-muted"
                >
                  Ciudad (*)
                </label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  value={ciudadId}
                  onChange={(e) => setCiudadId(e.target.value)}
                > 
                <option value=""></option>
                    {ciudad.map((dato,key) => (
                        <option key={key} value={dato.id_ciudad}>
                    {dato.nombre}
                </option>
                ))}
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <button
                  type="submit"
                  aria-disabled="false"
                  className="btn btn-success border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                  style={{ height: "40px" }}
                  onClick={insertPista}
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
                  onClick={updatePista}
                  disabled={!estadoAct}
                >
                  Actualizar
                </button>
              </div>
            </div>
            
            <div className="row mt-5">
              <div className="col-md-12 table-responsive">
                <h5>Pistas Registradas</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Pista</th>
                      <th>Terreno</th>
                      <th>Pais</th>
                      <th>Departamento</th>
                      <th>Ciudad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                  {pista.map((dato, index) => (
                     <tr key={index}>
                     <td>{dato.nombre}</td>
                     <td>{dato.terreno}</td>
                     <td>{dato.pais}</td>
                     <td>{dato.departamento}</td>
                     <td>{dato.ciudad}</td>
                     <td style={{width:'200px'}}>
                         <button className="btn btn-warning btn-sm me-2" onClick={() => searchPista(dato.id_pista)}  id='btn_eliminar'>Actualizar</button>
                         <button className="btn btn-danger btn-sm"  onClick={() => eliminarPista(dato.id_pista)}  id='btn_eliminar'>Eliminar</button>
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
