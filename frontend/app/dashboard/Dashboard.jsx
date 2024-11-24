'use client'

import React from 'react'
import NavBar from '../Components/NavBar'
import { AcmeLogo } from '../Components/AcmeLogo'
import { useEffect } from 'react';
import styles from './page.module.css'

function Dashboard() {

  useEffect(() => {
    // Asegúrate de que el JS de Bootstrap se cargue en el lado del cliente
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <div>

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
              src="https://www.dsf.my/wp-content/uploads/2018/02/ducati-panigale-v4h.jpg"
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

    



    </div>
  )
}

export default Dashboard