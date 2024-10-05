import React, { useState, useEffect } from 'react'
import Image from 'next/image'

function ImageBG({BGimage}) {

  const [BGimageUrl,setBGimageUrl]=useState("");
  const backgroundStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%'
  };
  const getImage = async () =>
    {
     
  
      try {
 
        const response = await fetch(`https://moto-racing.onrender.com/s3/?path=assets/${BGimage}`, 
          {
            method: 'GET'
          });

      
 
          if (!response.ok) {
            throw new Error('Error al obtener la URL de la imagen');
          }

          const data = await response.json();
          
          setBGimageUrl(data.url);

       
      } catch (error) {
        console.log(error);
      }
     
   }

   useEffect(() => {
    getImage();
   

   }, [])
   

  return (

    <div>
      <img className='img' src={BGimageUrl}>
      
      </img>

      <div className='overlay'></div>

       <style jsx>{`
         .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.36); /* Oscurece el fondo */
          z-index: -1;
        }
        
           .img {
            position: fixed;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -1;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

        `}</style>
    </div>

    
  )

  
}

export default ImageBG