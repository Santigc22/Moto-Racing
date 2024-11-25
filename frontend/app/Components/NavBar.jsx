"use client";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./NavBar.css";
import { useRouter } from "next/navigation";
import { datapostputdelget } from "./Peticiones";

function NavBar() {

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState("");

  const [profileName, setProfileName] = useState("");

  const getName = async () =>
  {
    const responses = await datapostputdelget("/usuarios/info", "" ,"GET");
    console.log(responses);
   

      if(!responses)
      {
        setProfileName(" Perfil")
      }
      else{
        setProfileName(responses.user_name);
      }
      
    }
  

  useEffect(() => {
    getName();
  }, [])
  

  const [isCollapsed, SetIsCollapsedSidebar] = useState(false);

  const ToggleSidebarCollapseHandler =()=>
  {
      SetIsCollapsedSidebar((prev) => !prev);
  }

  const OutSession = () =>
  {
    router.push("/")
  }


  const sidebarItems = [
    {
        name: "Home",
        href: "/dashboard",
        icon: <i className="bi bi-house"></i>
    },
    {
        name: "Competiciónes NF",
        href: "",
        icon: <i className="bi bi-person-badge-fill"></i>
    },
    {
        name: "Carreras NF",
        href: "/oportunities",
        icon: <i className="bi bi-briefcase"></i>
    },
    {
        name: "Pistas NF",
        href: "/pista",
        icon: <i className="bi bi-building"></i>
    },
    {
        name:"Pilotos NF",
        href:"/postulantes",
        icon: <i className="bi bi-people-fill"></i>
    },
    {
      name:"Motos NF",
      href:"/moto",
      icon: <i className="bi bi-clipboard2-check-fill"></i>
    },
    {
        name:"Equipos",
        href:"/equipos",
        icon: <i class="bi bi-people-fill"></i>
    },
    {
        name:"Patrocinadores NF",
        href:"/legalizaciones",
        icon:<i className="bi bi-pencil"></i>
    },
    {
      name:"Patrocinios NF",
      href:"/legalizaciones",
      icon:<i className="bi bi-pencil"></i>
    },
    {
      name:"Patrocinadores 4NF",
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
    <div className={'customPagePad'}>
   
    <div className={`d-flex pt-2 mb-4 pb-2 align-items-center container-fluid NavBar`}> 

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

      <div className={`d-flex align-items-center text-center col-3`}>

        <div>

          <a href="./dashboard">Inicio</a>

        </div>

      </div>

      <div className={`d-flex fs-3 text-white align-items-center col-3 justify-content-end`}>

              <Link href={"/profile"} className=" text-decoration-none text-white d-flex align-items-center">
                      <span className='siderbar__icon'>
                      <i class="bi bi-person-circle fs-3 text-white m-2 position-relative"  style={{bottom: "3px"}}></i>
                      </span>
                      <h3 className={`sider__name `}> {profileName}</h3>
              </Link>
      
       
      </div>
    
      <div  className={`d-flex align-items-center col-3 justify-content-end`}>

        <button className={`EndSession-btn`} onClick={OutSession}>

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

    </div>

  )
}

export default NavBar;
