'use client'
import React, { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ImageBG from '../Components/ImageBG';

function Profile() {
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [tipoIden, setTipoIden] = useState('')
    const [identificacion, setIdentificacion] = useState('')
    const [fechaNaci, setFechaNaci] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [tipoUser, setTypeUserSelected] = useState('')
    const [correo, setCorreo] = useState('')
    const [preview, setPreview] = useState(null);

    const [BGimage, setBGimage] = useState("moto1.jpg")

    const router = useRouter()

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('https://moto-racing.onrender.com/usuarios/info')
            const data = await response.json()
            if (response.ok) {
                const userData = data.data
                setNombre(userData.nombre)
                setApellido(userData.apellido)
                setTipoIden(userData.tipoIden)
                setIdentificacion(userData.identificacion)
                setFechaNaci(userData.fechaNaci)
                setDireccion(userData.direccion)
                setTelefono(userData.telefono)
                setTypeUserSelected(userData.tipoUser)
                setCorreo(userData.correo)
                setPreview(userData.profilePicture)
            } else {
                console.log("Error al obtener los datos del usuario")
            }
        } catch (err) {
            console.error("Error al hacer la solicitud:", err)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    const goToHome = () => {
        router.push('/')
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
            <ImageBG BGimage={BGimage}/>
            <main className={`${styles.main}`}>
                <div className={`position-relative text-white overflow-hidden border border-danger ${styles.customShadow}`}>
                    <div className="d-flex flex-column bg-black align-middle justify-content-center border-bottom border-danger px-5 py-2 pt-4 text-center">
                        <h3 className="h5 font-weight-bold">Información del usuario</h3>
                    </div>

                    <div className={`d-flex flex-column gap-1 px-5 py-4 px-sm-5 ${styles.customBackground}`}>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Nombre</label>
                                <p className="form-control bg-dark text-white">{nombre}</p>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Apellido</label>
                                <p className="form-control bg-dark text-white">{apellido}</p>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Tipo de Identificación</label>
                                <p className="form-control bg-dark text-white">{tipoIden}</p>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Identificación</label>
                                <p className="form-control bg-dark text-white">{identificacion}</p>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Fecha de Nacimiento</label>
                                <p className="form-control bg-dark text-white">{fechaNaci}</p>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Dirección</label>
                                <p className="form-control bg-dark text-white">{direccion}</p>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Teléfono</label>
                                <p className="form-control bg-dark text-white">{telefono}</p>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Correo Electrónico</label>
                                <p className="form-control bg-dark text-white">{correo}</p>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label text-white text-uppercase small">Tipo de Usuario</label>
                                <p className="form-control bg-dark text-white">{tipoUser}</p>
                            </div>
                            <div className="col-md-6">
                                {preview && (
                                    <div>
                                        <h3>Foto de Perfil:</h3>
                                        <img src={preview} alt="Previsualización" width="200" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-12">
                                <button
                                    className="btn btn-primary d-flex align-items-center justify-content-center w-100 mt-4"
                                    style={{ height: "40px" }}
                                    onClick={goToHome}
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

export default Profile;
