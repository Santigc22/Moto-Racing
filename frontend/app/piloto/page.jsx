"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [idPiloto, setIdPiloto] = useState("");
    const [nombre, setNombre] = useState("");
    const [altura, setAltura] = useState("");
    const [alr, setAlr] = useState("");
    const [tipoSangre, setTipoSangre] = useState("");
    const [pilotos, setPilotos] = useState([]);
    const [estadoAct, setEstadoAct] = useState(false);
    const [estadoReg, setEstadoReg] = useState(true);

    const getPilotos = () => {
        try {
            fetch(`http://localhost:3001/pilotos/getPilotos`)
                .then((res) => res.json())
                .then((data) => {
                    setPilotos(data.response);
                });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const validarCampos = () => {
        if (!nombre || !altura || !alr || !tipoSangre) {
            alert("Todos los campos son obligatorios.");
            return false;
        }
        return true;
    };

    const insertPiloto = async () => {
        if (!validarCampos()) {
            return;
        }

        try {
            fetch(`http://localhost:3001/pilotos/setPiloto`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    altura,
                    alr,
                    tipoSangre,
                }),
            })
                .then((res) => res.json())
                .then((responseData) => {
                    alert(responseData["message"]);
                    setNombre("");
                    setAltura("");
                    setAlr("");
                    setTipoSangre("");
                });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const searchPiloto = async (id) => {
        try {
            fetch(`http://localhost:3001/pilotos/getPilotoById`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
                .then((res) => res.json())
                .then((responseData) => {
                    setIdPiloto(responseData.response[0]['id']);
                    setNombre(responseData.response[0]['nombre']);
                    setAltura(responseData.response[0]['altura']);
                    setAlr(responseData.response[0]['alr']);
                    setTipoSangre(responseData.response[0]['tipo_sangre']);
                    setEstadoAct(true); 
                    setEstadoReg(false);
                });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const updatePiloto = async () => {
        try {
            fetch(`http://localhost:3001/pilotos/updatePiloto`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idPiloto,
                    nombre,
                    altura,
                    alr,
                    tipoSangre,
                }),
            })
                .then((res) => res.json())
                .then((responseData) => {
                    alert(responseData["message"]);
                    setEstadoReg(true);
                });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const inactivarPiloto = async (id) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas Inactivar?`);

        if (confirmacion) {
            fetch(`http://localhost:3001/pilotos/updateEstadoPiloto/${id}`, {
                method: 'POST',
            })
                .then(res => res.json())
                .then(responseData => {
                    alert(responseData["message"]);
                });
        } else {
            console.log(`No se realizó la inactivación.`);
        }
    };

    useEffect(() => {
        getPilotos();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
            <main className="main">
                <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">
                    <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
                        <h3 className="h5 font-weight-bold">Registro de Pilotos</h3>
                    </div>
                    <input
                        id="id_resgistro"
                        type="hidden"
                        value={idPiloto}
                    />
                    <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label text-uppercase small text-muted">
                                    Nombre (*)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-uppercase small text-muted">
                                    Altura (*)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={altura}
                                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                                    onChange={(e) => setAltura(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label text-uppercase small text-muted">
                                    ALR (*)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={alr}
                                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                                    onChange={(e) => setAlr(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-uppercase small text-muted">
                                    Tipo de sangre (*)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={tipoSangre}
                                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                                    onChange={(e) => setTipoSangre(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <button
                                    type="submit"
                                    className="btn btn-success border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                                    style={{ height: "40px" }}
                                    onClick={insertPiloto}
                                    disabled={!estadoReg}
                                >
                                    Registrarse
                                </button>
                            </div>

                            <div className="col-md-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                                    style={{ height: "40px" }}
                                    onClick={updatePiloto}
                                    disabled={!estadoAct}
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-12">
                                <h5>Pilotos Registrados</h5>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Altura</th>
                                            <th>ALR</th>
                                            <th>Tipo de sangre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pilotos.map((dato, index) => (
                                            <tr key={index}>
                                                <td>{dato.nombre}</td>
                                                <td>{dato.altura}</td>
                                                <td>{dato.alr}</td>
                                                <td>{dato.tipo_sangre}</td>
                                                <td style={{width:'200px'}}>
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => searchPiloto(dato.id)} id='btn_eliminar'>Actualizar</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => inactivarPiloto(dato.id)} id='btn_eliminar'>Inactivar</button>
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
