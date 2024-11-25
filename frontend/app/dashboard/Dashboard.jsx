'use client'

import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import { AcmeLogo } from '../Components/AcmeLogo'
import { useEffect } from 'react';
import styles from './page.module.css'
import DashboardCards from '../Components/DashboardCards';

function Dashboard() {

  const [Competencias, setCompetencias] = useState([]);

  const GetCompetencies = async () =>
    {

      try {
 
        const response = await fetch('https://moto-racing.onrender.com/competencia', 
          {
            method: 'GET',
            
          });
 
          if (response.ok) {
            const data = await response.json();
            const compeData = await data.competencias
            setCompetencias(compeData);
            console.log(compeData);
           // router.push("/dashboard");
         } else {
           alert("Algo ha salido mal");
         }
 
          console.log(response.json);
       
      } catch (error) {
        console.log(error);
      }
     
   }

  useEffect(()=>
  {
    GetCompetencies();
  },[])

  useEffect(() => {
    // Asegúrate de que el JS de Bootstrap se cargue en el lado del cliente
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <div style={{height:'100vh'}}>

    <NavBar />

    {/* CONTENIDO DEL DB 
    
    
    ${styles.customCarouselInner}

    ${styles.customCarouselItem}
    */}

    <div>
      <div id="carouselExampleControls" className={`carousel slide ${styles.customCarouselSlide}`} data-bs-ride="carousel" data-bs-interval="3000">
      <div className={styles.customCarouselText}>
              MOTO-RACING
            </div>
        <div className={`carousel-inner ${styles.customCarouselInner}`}>
          {/* Primera imagen */}
          <div className={`carousel-item active ${styles.customCarouselItem}`}>
            <img
              src="https://preview.redd.it/emextglktw771.jpg?auto=webp&s=87d0301b4cc6cfc7e424faa430778c6547413dad"
              className={`d-block ${styles.customCraouselImg}`}
              alt="Imagen 1"
            />
          </div>

          {/* Segunda imagen */}
          <div className={`carousel-item ${styles.customCarouselItem}`}>
            <img
              src="https://www.dsf.my/wp-content/uploads/2018/02/ducati-panigale-v4h.jpg"
              className={`d-block ${styles.customCraouselImg}`}
              alt="Imagen 2"

            />
          </div>

          {/* Tercera imagen */}
          <div className={`carousel-item ${styles.customCarouselItem}`}>
            <img
              src="https://cdn-fastly.motorcycle.com/media/2023/03/20/10977835/8-essential-motorcycle-riding-skills.jpg?size=720x845&nocrop=1"
              className={`d-block ${styles.customCraouselImg}`}
              alt="Imagen 3"

            />
          </div>

          <div className={`carousel-item ${styles.customCarouselItem}`}>
            <img
              src="https://publimotos.com/wp-content/uploads/2023/11/Atencion-KTM-1390-Super-Duke-R-y-Super-Duke-R-EVO-La-marca-va-a-regalar-a-un-mortal-la-bestia-Hypernaked-Aqui-le-decimos-como.jpg"
              className={`d-block ${styles.customCraouselImg}`}
              alt="Imagen 1"
            />
          </div>
        </div>

        {/* Controles de navegación */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>

    <div className={styles.SubSection}>
      Competencias
    </div>

      <div className={`d-flex ${styles.competencesRail}`}>
        

          
         {Array.isArray(Competencias) && Competencias.map((Compe, index) => (

    <ul>
          <DashboardCards
          key={index}
          competenceTitle={Compe.nombre}
          competenceDescription={Compe.descripcion}/>
    </ul>         
          ))}

      </div>

    </div>
  )
}

export default Dashboard