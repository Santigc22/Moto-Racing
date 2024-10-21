"use client";
import { useState, useEffect } from "react";
import Select from 'react-select';

export default function Home() {
    const [isClient, setIsClient] = useState(false); // Para verificar si estamos en el cliente
    const [idMoto, setIdMoto] = useState("");
    const [pilotoId, setPilotoId] = useState("");
    const [soatId, setSoatId] = useState("");
    const [modeloId, setModeloId] = useState("");
    const [marcaMotoId, setMarcaMotoId] = useState("");
    const [anio, setAnio] = useState("");
    const [cilindraje, setCilindraje] = useState("");
    const [pilotos, setPilotos] = useState([]);
    const [marcaMoto, setMarcaMoto] = useState([]);
    const [modeloMoto, setModeloMoto] = useState([]);
    const [seguros, setSeguros] = useState([]);
    const [motos, setMotos] = useState([]);
    const [tipoMoto, setTipoMoto] = useState([]);
    const [estadoAct, setIEstadoActu] = useState(false);
    const [estadoRe, setIEstadoRegi] = useState(true);

    useEffect(() => {
        setIsClient(true); // Activamos la variable cuando estamos en el cliente
    }, []);


    //Trae los pilotos creados 
    const setPiloto = () => {
        try {
            fetch(`http://localhost:8080/motos/getPilotos/`)
            .then((res) => res.json())
            .then((data) => {
                setPilotos(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };


    //Trae las marcas creadas
    const MarcaMoto = () => {
      try {       
          fetch(`http://localhost:8080/motos/getMarca/`)
          .then((res) => res.json())
          .then((data) => {
            setMarcaMoto(data.response);
          });
      } catch (err) {
          console.error("Error al hacer la solicitud:", err);
      }
    };

    //trae los seguros creados
    const getSeguros = () => {
      try {
          fetch(`http://localhost:8080/motos/getSeguros/`)
          .then((res) => res.json())
          .then((data) => {
            setSeguros(data.response);
          });
      } catch (err) {
          console.error("Error al hacer la solicitud:", err);
      }
    };

    //Trae las los registros de la tabla motos
    const getMotos = () => {
        try {
            fetch(`http://localhost:8080/motos/getMotos/`)
            .then((res) => res.json())
            .then((data) => {
                setMotos(data.response);
            });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    //funcion que valida los cambios obligatorios
    const validarCampos = () => {
        if (!pilotoId || !marcaMotoId || !modeloId || !soatId) {
            alert("Todos los campos son obligatorios.");
        return false;
        }
        return true;
    };

    //Funcion que inserta los registros en la base de datos
    const insertMoto = async () => {
        if (!validarCampos()) {
            return;
        }

        try {
        fetch(`http://localhost:8080/motos/setMotos`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pilotoId,
                soatId,
                modeloId
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            alert(responseData["message"]);

            setPilotoId("");
            setMarcaMotoId("");
            setModeloId("");
            setAnio("");
            setCilindraje("");
            setTipoMoto("");
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };

    //Busca los datos de la moto por el id, para cargarlos en los campos
    const searchMoto = async (id) => {
        try {
        fetch(`http://localhost:8080/motos/motoId`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id
            }),
        })
            .then((res) => res.json())
            .then((responseData) => {
            getModeloMoto(responseData.response[0]['id_marca']);
            
              getModeloId(responseData.response[0]['id_modelo_moto'])
              setIdMoto(responseData.response[0]['id'])
              setPilotoId(responseData.response[0]['piloto_id']);
              setSoatId(responseData.response[0]['id_seguro']);
              setMarcaMotoId(responseData.response[0]['id_marca']);
              setModeloId(responseData.response[0]['id_modelo_moto']);
              setIEstadoActu(true); 
              setIEstadoRegi(false);
            });
        } catch (err) {
        console.error("Error al hacer la solicitud:", err);
        }
    };

    //Funcion que actulzia la informacion de las motos, registradas
    const updateMoto = async (id) => {
      try {
        fetch(`http://localhost:8080/motos/updateMoto`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idMoto,
              pilotoId,
              soatId,
              modeloId
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

    //Funcion que cambia de estado el registro de la moto(inactiva la moto)
    const inactivarMoto = async (id) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas Inactivar ?`);
        if (confirmacion) {
            fetch(`http://localhost:8080/motos/updateEstado/${id}`, {
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

    //busca el modelo de la moto por la marca
    const getModeloMoto = (selectedMarcaId) => {
      try {
          fetch(`http://localhost:8080/motos/getModeloMoto/`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedMarcaId
          }),
      })
          .then((res) => res.json())
          .then((data) => {
            setModeloMoto(data.response);  
            setAnio("");
            setCilindraje("");
            setTipoMoto("");
          });
      } catch (err) {
          console.error("Error al hacer la solicitud:", err);
      }
    };

    //Busca el modelo por el id
    const getModeloId = (selectedModeloId) => {
      try {
          fetch(`http://localhost:8080/motos/getModeloId/`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedModeloId
          }),
      })
          .then((res) => res.json())
          .then((data) => {
            setAnio(data.response[0]['anio']);    
            setCilindraje(data.response[0]['cilindraje']);    
            setTipoMoto(data.response[0]['tipo']);    
          });
      } catch (err) {
          console.error("Error al hacer la solicitud:", err);
      }
    };

    // Preparación de opciones para react-select
    const opcionesPiloto = pilotos.map((dato) => ({
      value: dato.id,
      label: dato.nombre
    }));

    const opcionesMarca = marcaMoto.map((dato) => ({
      value: dato.id,
      label: dato.nombre
    }));

    const opcionesModelo = modeloMoto.map((dato) => ({
      value: dato.id,
      label: dato.modelo
    }));

    const opcionesSoat = seguros.map((dato) => ({
      value: dato.id,
      label: dato.nombre
    }));

    const handlePilotoChange = (selectedOption) => {
      setPilotoId(selectedOption ? selectedOption.value : "");
    };

    const handleMarcaChange = (selectedOption) => {
      const selectedMarcaId = selectedOption ? selectedOption.value : "";
      setMarcaMotoId(selectedMarcaId);
      if (selectedMarcaId) {
        getModeloMoto(selectedMarcaId);
      }
    };

    const handleModeloChange = (selectedOption) => {
      const selectedModeloId = selectedOption ? selectedOption.value : "";
      setModeloId(selectedModeloId);
      if (selectedModeloId) {
        getModeloId(selectedModeloId);
      }
    };

    const handleSoatChange = (selectedOption) => {
      setSoatId(selectedOption ? selectedOption.value : "");
    };

    useEffect(() => {
        setPiloto();
        getMotos();
        MarcaMoto();
        getSeguros();
    }, []);

  // Renderizado condicional solo si estamos en el cliente
  if (!isClient) {
      return null;  // Evitar renderizar en el servidor
  }

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className="main">
        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
          <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Registro de motos</h3>
          </div>
          <input id="id_resgistro" type="hidden" value={idMoto} />
          <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="piloto" className="form-label text-uppercase small text-muted">
                  Piloto (*)
                </label>
                <Select
                  id="piloto"
                  value={opcionesPiloto.find(opcion => opcion.value === pilotoId)}
                  onChange={handlePilotoChange}
                  options={opcionesPiloto}
                  isClearable
                  placeholder="Seleccione un piloto"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="marca" className="form-label text-uppercase small text-muted">
                  Marca (*)
                </label>
                <Select
                  id="marca"
                  value={opcionesMarca.find(opcion => opcion.value === marcaMotoId)}
                  onChange={handleMarcaChange}
                  options={opcionesMarca}
                  isClearable
                  placeholder="Seleccione una marca"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="modelo" className="form-label text-uppercase small text-muted">
                  Modelo (*)
                </label>
                <Select
                  id="modelo"
                  value={opcionesModelo.find(opcion => opcion.value === modeloId)}
                  onChange={handleModeloChange}
                  options={opcionesModelo}
                  isClearable
                  placeholder="Seleccione un modelo"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="soat" className="form-label text-uppercase small text-muted">
                  SOAT (*)
                </label>
                <Select
                  id="soat"
                  value={opcionesSoat.find(opcion => opcion.value === soatId)}
                  onChange={handleSoatChange}
                  options={opcionesSoat}
                  isClearable
                  placeholder="Seleccione un seguro"
                />
              </div>
            </div>

            <div className="row mt-12">
              <div className="col-md-4">
                <label htmlFor="soat" className="form-label text-uppercase small text-muted">
                  Año
                </label>
                <input
                  id="soat"
                  type="text"
                  disabled={true}
                  value={anio}
                  style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
                  className="mt-1 form-control rounded border border-gray-200 shadow-sm"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="cilindraje" className="form-label text-uppercase small text-muted">
                  Cilindraje
                </label>
                <input
                  id="cilindraje"
                  type="text"
                  value={cilindraje}
                  disabled={true}
                  style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
                  className="mt-1 form-control rounded border border-gray-200 shadow-sm"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="tipoMoto" className="form-label text-uppercase small text-muted">
                  Tipo de moto
                </label>
                <input
                  id="tipoMoto"
                  type="text"
                  value={tipoMoto}
                  disabled={true}
                  style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
                  className="mt-1 form-control rounded border border-gray-200 shadow-sm"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  onClick={insertMoto}
                  disabled={!estadoRe}
                >
                  Registrar
                </button>
              </div>
              <div className="col-md-6">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
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
                      <th>Año</th>                      
                      <th>Cilindraje</th>
                      <th>Tipo moto</th>
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
                      <td>{dato.anio}</td>                     
                      <td>{dato.cilindraje}</td>
                      <td>{dato.tipo}</td>
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
