import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (

   

    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <main className={styles.main}>

        <div className="position-relative vw-75 overflow-hidden rounded border border-gray-100 shadow-lg">

        <div className="d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 bg-white px-5 py-2 pt-4 text-center">
          <h3 className="h5 font-weight-bold">Inicio de sesión</h3>
          <p className="small text-muted">Usa tu correo y contraseña para acceder</p>
        </div>

        <div className="d-flex flex-column gap-1 bg-light px-5 py-4 px-sm-5">

          <label htmlFor="username_input" className="form-label text-uppercase fs- text-muted">Nombre de usuario</label>
          
          <input id="username_input" type="text" placeholder="user@acme.com" required 
          className={`mt-1 form-control bg-white rounded border border-gray-200 shadow-sm text-gray-200 ${styles.customInput}`}
          ></input>

            <br></br>

          <div>
            <label htmlFor="password" className="form-label text-uppercase small text-muted">Contraseña</label>
            <input id="password" required className={`mt-1 form-control bg-white rounded border border-gray-200 shadow-sm ${styles.customInput}`} 
            type="password" name="password"></input>
          </div>

            <br></br>

          <button type="submit" aria-disabled="false" className="btn btn-white border border-gray-200 d-flex align-items-center justify-content-center w-100" style={{height: "40px"}}>
            Iniciar sesión
          </button>

          
        </div>
      </div>

      </main>
    </div>
  );
}
