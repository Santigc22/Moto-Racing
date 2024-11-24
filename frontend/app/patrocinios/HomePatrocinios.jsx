"use client";

import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import Pilotos from "./Pilotos";
import Equipos from "./Equipos";
import PatrociniosUsuario from "./PatrociniosUsuario";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import { NavBar } from "../Components/NavBar";

function HomePatrocinios() {
	const [key, setKey] = useState(null); // Estado para la pestaña activa

	// Función que alterna la pestaña activa
	const handleTabSelect = (k) => {
		setKey((prevKey) => (prevKey === k ? null : k));
	};

	return (
		<>
			<NavBar />
			<div className="container my-4">
				<h1>Patrocinios</h1>
				<Tabs
					id="patrocinios-tabs"
					activeKey={key}
					onSelect={handleTabSelect}
					className="mb-3"
				>
					<Tab eventKey="pilotos" title="Pilotos">
						{key === "pilotos" && <Pilotos />}
					</Tab>
					<Tab eventKey="equipos" title="Equipos">
						{key === "equipos" && <Equipos setCurrentView={setKey} />}
					</Tab>
					<Tab eventKey="carreras" title="Carreras">
						{key === "carreras" && <h2>Vista de Carreras</h2>}
					</Tab>
					<Tab eventKey="competencias" title="Competencias">
						{key === "competencias" && <h2>Vista de Competencias</h2>}
					</Tab>
				</Tabs>
				<PatrociniosUsuario />{" "}
				{/* Componente de Patrocinios que se muestra debajo */}
			</div>
		</>
	);
}

export default HomePatrocinios;
