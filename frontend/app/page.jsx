'use client'
import styles from "./page.module.css";
import { useState } from "react";
import VideoBackground from "./Components/VideoBackground";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();

  const [username, setUsername] = useState("");

  const [Password, setPassword] = useState("");

  const UsernameHandler = (e) =>
  {
    setUsername(e);
  }

  const PasswordHandler = (e) =>
  {
    setPassword(e);
  }

   const SubmitHandler = async (e) =>
   {
    
     e.preventDefault();
     try {

       const response = await fetch('https://moto-racing.onrender.com/usuarios/login', 
         {
           method: 'POST',
           body: JSON.stringify(
             {
               username: username, 
               password: Password
             }),
             headers: {
               'content-type': 'application/json'
             }
         });

         if (response.ok) {
          router.push("/dashboard");
        } else {
          alert("Algo ha salido mal");
        }

         console.log(response.json);
      
     } catch (error) {
       console.log(error);
     }
    
  }

  return (

   

    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
       

       <VideoBackground/>
      <main className={styles.main}>

        <form onSubmit={(e) =>SubmitHandler(e)} className={`position-relative vw-75 overflow-hidden rounded border border-gray-100 ${styles.customShadow}`}>

        <div className={`d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 px-5 py-2 pt-4 text-center ${styles.customBackground}`}>
          <h3 className="h5 text-white text-uppercase font-weight-bold">Inicio de sesión</h3>
          <p className="small text-white-50">Usa tu correo y contraseña para acceder</p>
        </div>

        <div className={`d-flex flex-column gap-1 px-5 py-4 px-sm-5 ${styles.customBackground}`}>

          <label htmlFor="username_input" className="form-label text-uppercase text-white">Nombre de usuario</label>
          
          <input onChange={(e)=>{UsernameHandler(e.target.value)}} id="username_input" type="text" placeholder="user@acme.com" required 
          className={`mt-1 form-control rounded border border-gray-200 shadow-sm text-black ${styles.customInput}`}
          ></input>

          <br></br>

          <div>
            <label htmlFor="password" className="form-label text-uppercase text-white">Contraseña</label>
            <input onChange={(e)=>{PasswordHandler(e.target.value)}} id="password" required className={`mt-1 form-control rounded border border-gray-200 text-black shadow-sm ${styles.customInput}`} 
            type="password" name="password"></input>
          </div>

          <br></br>

          <button type="submit" aria-disabled="false" className={`btn text-uppercase text-white btn-white border border-gray-200 d-flex align-items-center justify-content-center w-100 ${styles.customHoverEffect}`} style={{height: "40px"}}>
            Iniciar sesión
          </button>

          <a>Registrate</a>

          
        </div>
      </form>

      
     

      </main>
    </div>
  );
}
