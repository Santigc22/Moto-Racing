import React, { useState } from 'react'
import  './DashboardCards.css'

function DashboardCards({competenceTitle, competenceDescription}) {

    const [ImgArray, setImgArray] = useState(['https://img.motoryracing.com/galeria/6000/6658_valentino-rossi-besa-trofeo-gp-italia.jpg', 'https://mx1onboard.com/wp-content/uploads/2024/11/seewer.jpg', 'https://aprilia-colombia.com/wp-content/uploads/2023/03/pistas-de-carreras-2.webp', 'https://cdn.shopify.com/s/files/1/2301/5125/files/ariel-view-of-a-motocross-track_1024x1024.jpg?v=1602608950', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0SQuBxMckS5THM3CIjSyryQZrPCR4fYB5RQ&s'])

        console.log(Math.floor(Math.random() * ImgArray.length));

  return (

        
            <li className="competenceItem">
                <div className='infoItem'>
                    <h3>
                    {competenceTitle}
                    </h3>
                </div>

                <div className='descriptionItem'>
                    <h4>
                    {competenceDescription}
                    </h4>
                </div>
                
                <div className="imageContainer">
                    <img
                        src={ImgArray[Math.floor(Math.random() * ImgArray.length)]}
                        className="cardImg"
                        alt="Imagen 3"
                    />
                </div>
            </li>
        
 
  )
}

export default DashboardCards