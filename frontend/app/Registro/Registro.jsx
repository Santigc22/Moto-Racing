import React from 'react';
import styles from "./page.module.css";

function Registro() {
  return (
    <div className={`d-flex flex-column align-items-center vh-100 justify-content-center ${styles.customForm}`}>
      
      <main className={styles.main}>

          <form className={`position-relative vw-75 overflow-hidden rounded border border-gray-100 ${styles.customShadow}`}>

          <div className={`d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 px-5 py-2 pt-4 text-center`}>
            <h3 className="h5 text-white text-uppercase font-weight-bold">Registro</h3>
            <p className="small text-white-50">Usa tu correo y contraseña para crear tu cuenta</p>
          </div>
        
          <label htmlFor='name'>Nombre</label>
          
          <input id='name'></input>

          <br></br>

          <label htmlFor='lastname'>Apellido</label>

          <input id='lastname'></input>

          <br></br>

          <label htmlFor='identificationType'>Tipo de identificación</label>

          <input id='identificationType'></input>

          <br></br>

          <label htmlFor='identificationNumber'>Identificación</label>

          <input id='identificationNumber'></input>

          <br></br>

          <label htmlFor='birthDate'>Fecha de nacimiento</label>

          <input id='birthDate'></input>

          <br></br>

          <label htmlFor='Address'>Direccion</label>

          <input id='Address'></input>

          <br></br>

          <label htmlFor='PhoneNumber'>Teléfono</label>

          <input id='PhoneNumber'></input>

          <br></br>

          <label htmlFor='username'>Nombre de usuario</label>

          <input id='username'></input>

          <br></br>

          <label htmlFor='password'>Contraseña</label>

          <input id='password'></input>

          <br></br>

          <label htmlFor='password_confirm'>Confirmar contraseña</label>

          <input id='password_confirm'></input>

          </form>
      </main>
    </div>
  )
}

export default Registro