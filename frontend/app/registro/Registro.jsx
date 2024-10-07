'use client'
import React, { useEffect } from 'react';
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageBG from '../Components/ImageBG';

function Registro() {


  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoIden, setTipoIden] = useState();
  const [identificacion, setIdentificacion] = useState('');
  const [fechaNaci, setFechaNaci] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUser, setTypeUserSelected] = useState();
  const [showPilotForm, setShowPilotForm] = useState();

  const showForm = () =>
  {
   
      setShowPilotForm(tipoUser == 4 ? true : false);
    

  }

  useEffect(() => {
    
    showForm();
 
  }, [tipoUser])
  

  const [BGimage, setBGimage] = useState("moto1.jpg");
 
  const [IdentificationTypes, setIdentificationTypes] = useState([]);
  const [UserTypes, setUserTypes] = useState([]);
  const [BloodTypes, setBloodTypes] = useState([]);

  



  const IdentificationTypesFetch = async () =>
  {
    
    try {
      const response = await fetch('https://moto-racing.onrender.com/tipos/tipo_identificacion');

      const data = await response.json();
      setIdentificationTypes(data.data);
    } catch (err) {
      console.error("Error al hacer la solicitud:", err);
    }
    
  }

  
  const UserTypesFetch = async () =>
    {
      
      try {
        const response = await fetch('https://moto-racing.onrender.com/tipos/tipo_usuario');
  
        const data = await response.json();

        const result = data.data

        let adminIndex = result.findIndex(obj => obj.id === 1); // Encuentra el índice del objeto con id 2

        if (adminIndex > -1) {
          result.splice(adminIndex, 1); // Elimina 1 elemento en la posición index
        }
        setUserTypes(result);
      } catch (err) {
        console.error("Error al hacer la solicitud:", err);
      }
      
    }

    const BloodTypesFetch = async () =>
      {
        
        try {
          const response = await fetch('https://moto-racing.onrender.com/tipos/tipo_sangre');
    
          const data = await response.json();
          setBloodTypes(data.data);
        } catch (err) {
          console.error("Error al hacer la solicitud:", err);
        }
        
      }

  useEffect(() => {

    IdentificationTypesFetch();
    UserTypesFetch();
    BloodTypesFetch();

  }, [])
  
  

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
      !password ||
      !tipoUser
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
      await fetch('https://moto-racing.onrender.com/usuarios/setUser', {
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
          password,
          tipoUser
        }),
      })
        .then((res) => res.json())
        .then((responseData) => {

          setNombre("");
          setApellido("");
          setTipoIden("");
          setIdentificacion("");
          setFechaNaci("");
          setDireccion("");
          setTelefono("");
          setPassword("");
          setTypeUserSelected("");
        });
    } catch (err) {
      console.error("Error al hacer la solicitud:", err);
    }
  };



  const goToLogin = () => {
    router.push('/'); // Navega a la página RegisterUser
  };

  

 
  return (

 
      
    

    <div className="d-flex align-items-center justify-content-center">

<ImageBG BGimage={BGimage}/>
      
      <main className={`${styles.main}`}>
        <div className={`position-relative text-white overflow-hidden border border-danger ${styles.customShadow}`}>
          <div className="d-flex flex-column bg-black align-middle justify-content-center border-bottom border-danger px-5 py-2 pt-4 text-center">
            <h3 className="h5 font-weight-bold">Registro de usuario</h3>
          </div>

          <div className={`d-flex flex-column gap-1 px-5 py-4 px-sm-5 ${styles.customBackground}`}>
            
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label text-white text-uppercase small ">Nombre (*)</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder ="Adam"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="last_name" className=" text-white form-label text-uppercase small ">Apellido (*)</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder = "Muto"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="id_type" className="form-label text-uppercase small text-white">Tipo de Identificación (*)</label>
                <select
                  id="id_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setTipoIden(e.target.value)}
                >
                   <option value="" disabled selected> Seleccione una opción</option>
                  {Array.isArray(IdentificationTypes) && IdentificationTypes.map((IT, index) => (

                    <option key={IT.id} value={IT.id}>{IT.nombre} | ({IT.nombre_corto})</option>

                  ))}
                  
                </select>
              </div>
                <div className="col-md-6">
                  <label htmlFor="identificacion" className="form-label text-uppercase small text-white">Identificacion (*)</label>
                  <input
                    id="identificacion"
                    type="number"
                    required
                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                    onChange={(e) => setIdentificacion(e.target.value)}
                    placeholder = "0000000000"
                  />
                </div>
              
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="address" className="form-label text-uppercase small text-white">Dirección (*)</label>
                <input
                  id="address"
                  type="text"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder = "Carrera A # 00-00"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="birth_date" className="form-label text-uppercase small text-white">Fecha de Nacimiento (*)</label>
                <input
                  id="birth_date"
                  type="date"
                  pattern="/^\d{4}-\d{2}-\d{2}$/" 
                    title="El formato de la fecha debe ser YYYY-MM-DD"
                  required
                  placeholder="YYYY-MM-DD" 
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setFechaNaci(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label text-uppercase small text-white">Teléfono (*)</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder = "0000000000"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="user_type" className="form-label text-uppercase small text-white">Tipo de usuario (*)</label>
                <select
                  id="user_type"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                   onChange={(e) => setTypeUserSelected(e.target.value)}
                >
                   <option value="" disabled selected> Seleccione una opción</option>
                  {Array.isArray(UserTypes) && UserTypes.map((UT, index) => (

                    <option key={UT.id} value={UT.id}>{UT.tipo}</option>

                  ))}
                  
                </select>
              </div>

             
              
            </div>

            <div className={` row mt-3 ${showPilotForm ? styles.CustomPilotForm : styles.collapsed}`}>
                <div className="col-md-6">
                  <label htmlFor="Arl" className="form-label text-uppercase small text-white">ARL (*)</label>
                  <input
                    id="Arl"
                    type="text"
                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="blood_type" className="form-label text-uppercase small text-white">Tipo de sangre (*)</label>
                  <select
                    id="blood_type"
                    className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                    // onChange={(e) => setTipoIden(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled selected> Seleccione una opción</option>
                    {Array.isArray(BloodTypes) && BloodTypes.map((BT, index) => (

                      <option key={BT.id} value={BT.id}>{BT.tipo}</option>

                    ))}
                    
                  </select>
                </div>
              </div>

            <div className="row mt-3">
              <div className="col-md-12">
                <label htmlFor="password" className="form-label text-uppercase small text-white">Contraseña (*)</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 form-control bg-white rounded border border-gray-200 shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder ="Contraseña"
                />
              </div>

              
            </div>


            <div className="row mt-3 pilot_info">
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
   
  )
  
}

export default Registro