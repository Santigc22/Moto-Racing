"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [tipoIden, setTipoIden] = useState(1);
    const [fechaNaci, setFechaNaci] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');

    const router = useRouter();

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
    };

    const getInfo = async () => {
        const token = localStorage.getItem("MOTO_RACING_AUTH_TOKEN");

        const res = await fetch('http://localhost:3001/usuarios/info', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const response = await res.json();

        const formattedDate = response.user_fecha_nacimiento.split('T')[0];

        setNombre(response.user_name);
        setApellido(response.user_apellido);
        setFechaNaci(formattedDate);
        setDireccion(response.user_direccion);
        setTelefono(response.user_telefono);
        setTipoIden(1);
    };

    useEffect(() => {
        getInfo();
    }, []);

    const validarCampos = () => {
        if (!nombre || !apellido || !fechaNaci || !direccion || !telefono) {
            alert("Todos los campos son obligatorios.");
            return false;
        }
        return true;
    };

    const updateInfo = async () => {
        const token = localStorage.getItem("MOTO_RACING_AUTH_TOKEN");

        if (!validarCampos()) {
            return;
        }

        try {
            fetch(`http://localhost:3001/usuarios/update`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    tipoIden,
                    fechaNaci,
                    direccion,
                    telefono,
                }),
            })
                .then((res) => res.json())
                .then((responseData) => {
                    alert(responseData.mensaje);
                    setNombre("");
                    setApellido("");
                    setTipoIden("");
                    setFechaNaci("");
                    setDireccion("");
                    setTelefono("");
                });
        } catch (err) {
            console.error("Error al hacer la solicitud:", err);
        }
    };

    const goToLogin = () => {
        router.push('/'); 
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/path-to-your-background-image.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <div className="container bg-light p-5 rounded shadow-lg" style={{ maxWidth: '600px', border: '2px solid rgba(255, 0, 0, 0.8)', boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)' }}>
                <h3 className="text-center mb-4 text-danger">Actualizar Información</h3>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="first_name" className="form-label text-uppercase small text-muted">Nombre (*)</label>
                        <input
                            id="first_name"
                            type="text"
                            required
                            value={nombre}
                            className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="last_name" className="form-label text-uppercase small text-muted">Apellido (*)</label>
                        <input
                            id="last_name"
                            type="text"
                            value={apellido}
                            required
                            className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="address" className="form-label text-uppercase small text-muted">Dirección (*)</label>
                        <input
                            id="address"
                            type="text"
                            value={direccion}
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
                            value={fechaNaci}
                            required
                            className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                            onChange={(e) => setFechaNaci(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label text-uppercase small text-muted">Teléfono (*)</label>
                        <input
                            id="phone"
                            type="tel"
                            value={telefono}
                            required
                            className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <button
                            type="submit"
                            className="btn btn-danger border border-gray-200 d-flex align-items-center justify-content-center w-100 mt-4"
                            style={{ height: "40px" }}
                            onClick={updateInfo}
                        >
                            Actualizar información
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button
                            type="button"
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
    );
}
