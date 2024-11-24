import React, { useState } from 'react'
import  './DashboardCards.css'

function DashboardCards({competenceTitle},{competenceDescription}) {

    const [ImgArray, setImgArray] = useState(['https://th.bing.com/th/id/OIP.fd_uFqhzsElRa77FbjUQkQHaFj?w=1477&h=1108&rs=1&pid=ImgDetMain   ','https://www.the-race.com/content/images/size/w1200/2023/09/1073666.jpg','https://e00-marca.uecdn.es/assets/multimedia/imagenes/2020/08/10/15970690267373.jpg','https://images.alphacoders.com/130/1308978.jpeg','https://www.xtrafondos.com/wallpapers/carrera-de-motogp-9904.jpg','https://wallpapercave.com/wp/0jGZAWI.jpg','https://th.bing.com/th/id/R.4f465cfc1d5105e029952fedbc22682e?rik=D4hwpeI%2f8HHu7w&pid=ImgRaw&r=0'])

        console.log(Math.floor(Math.random() * ImgArray.length));

  return (
    <div>
        <ul>
            <li className="competenceItem">
                <div className='infoItem'>
                    <h3>
                    {competenceTitle}
                    </h3>

                    <div>
                        <p>{competenceDescription}</p>
                    </div>
                </div>
                <div className="imageContainer">
                    <img
                        src={ImgArray[Math.floor(Math.random() * ImgArray.length)]}
                        className="cardImg"
                        alt="Imagen 3"
                    />
                </div>
            </li>
        </ul>
    </div>
  )
}

export default DashboardCards