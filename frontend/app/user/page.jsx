"use client";

import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
    const [user, setUser] = useState({});

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
        setUser(response);
    };

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
            background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/path-to-your-background-image.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center" 
        }}>
            <div className="container bg-light p-5 rounded shadow-lg" style={{ maxWidth: '600px', border: '2px solid rgba(255, 0, 0, 0.8)', boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)' }}>
                <h3 className="text-center mb-4 text-danger">Información del Usuario</h3>
                <p className="text-center text-muted">Perfil y detalles personales</p>
                <hr className="border-danger"/>

                {/* Estilo aplicado a cada campo */}
                <div className="row mb-3">
                    <dt className="col-sm-4 text-danger">Nombre</dt>
                    <dd className="col-sm-8 styled-field">aaaaa {user.user_name}</dd>
                </div>
                <div className="row mb-3">
                    <dt className="col-sm-4 text-danger">Apellidos</dt>
                    <dd className="col-sm-8 styled-field">{user.user_apellido}</dd>
                </div>
                <div className="row mb-3">
                    <dt className="col-sm-4 text-danger">Cédula</dt>
                    <dd className="col-sm-8 styled-field">{user.user_identificcacion}</dd>
                </div>
                <div className="row mb-3">
                    <dt className="col-sm-4 text-danger">Fecha de Nacimiento</dt>
                    <dd className="col-sm-8 styled-field">{user.user_fecha_nacimiento}</dd>
                </div>
                <div className="row mb-3">
                    <dt className="col-sm-4 text-danger">Dirección</dt>
                    <dd className="col-sm-8 styled-field">{user.user_direccion}</dd>
                </div>
            </div>

            {/* Estilos en línea */}
            <style jsx>{`
                .styled-field {
                    background-color: #fff; /* Fondo blanco */
                    border: 1px solid #ced4da; /* Borde similar al de un input */
                    border-radius: 0.25rem; /* Bordes redondeados */
                    padding: 0.375rem 0.75rem; /* Relleno dentro del campo */
                    color: #495057; /* Color de texto */
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075); /* Sombra interna */
                    display: flex;
                    align-items: center;
                    min-height: 38px; /* Altura mínima similar a la de un input */
                }
            `}</style>
        </div>
    );
}
