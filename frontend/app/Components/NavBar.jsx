'use client'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react";
import Link from 'next/link';
import  './NavBar.css'


function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState("");

  const [isCollapsed, SetIsCollapsedSidebar] = useState(false);

  const ToggleSidebarCollapseHandler =()=>
  {
      SetIsCollapsedSidebar((prev) => !prev);
  }


  const sidebarItems = [
    {
        name: "Home",
        href: "/dashboard",
        icon: <i className="bi bi-house"></i>
    },
    {
        name: "Administradores",
        href: "/administradores",
        icon: <i className="bi bi-person-badge-fill"></i>
    },
    {
        name: "Oportunidades",
        href: "/oportunities",
        icon: <i className="bi bi-briefcase"></i>
    },
    {
        name: "Organizaciónes",
        href: "/organizaciones",
        icon: <i className="bi bi-building"></i>
    },
    {
        name:"Postulantes",
        href:"/postulantes",
        icon: <i className="bi bi-people-fill"></i>
    },
    {
        name:"Practicas",
        href:"/practicas",
        icon: <i className="bi bi-clipboard-check"></i>
    },
    {
        name:"legalizaciones",
        href:"/legalizaciones",
        icon:<i className="bi bi-pencil"></i>
    },
    {
        name: "Cerrar sesión",
        href:"/",
        icon:<i className="bi bi-box-arrow-left"></i>
    }
]

  return (
   
    <div className={`d-flex pt-2 pb-2 align-items-center container-fluid NavBar`}> 

      <div className={`d-flex align-items-center col-3 justify-content-evenly`}>

        <div>

          <button data-btn={isCollapsed} onClick={ToggleSidebarCollapseHandler} className="menu-btn w-auto h-auto bg-transparent">

          <i class="bi bi-list text-white fs-1"></i>

          </button>

        </div>

        <div>

          {/* <img></img> */}
          <p className={`mb-0 mt-0 text-white `}>Moto Racing</p>

        </div>
               

      </div>

      <div className={`d-flex align-items-center text-center col-6`}>

        <div>

          <a href="./dashboard">Inicio</a>

        </div>

      </div>
    
      <div  className={`d-flex align-items-center col-3 justify-content-end`}>

        <button className={`EndSession-btn`}>

        <i class="bi bi-box-arrow-right text-danger fs-1 "></i>

        </button>

      </div>

      {/**/}

      <div className='sidebar__wrapper'>
        <aside className='sidebar' data-collapse={isCollapsed}>
          <ul className='sidebar__list'>

            {sidebarItems.map(({name, href, icon: icon}, index) => (  
            <li key={index} className='sidebar__item'>
              <Link href={href} className='sidebar__link'>
                      <span className='siderbar__icon'>
                      {icon}
                      </span>
                      <span className='sidebar__name'>{name}</span>
              </Link>

              </li>))}

          </ul>

        </aside>
      </div>

    </div>

  )
}

export default NavBar