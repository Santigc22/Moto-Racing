"use client";

import React, { use, useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Pilotos from "./Pilotos";
import Equipos from "./Equipos";
import PatrociniosUsuario from "./PatrociniosUsuario";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PatrociniosEquipo from "./PatrociniosEquipo";
import PatrociniosPiloto from "./PatrociniosPiloto";
import Competencias from "./Competencias";
// import { NavBar } from "../Components/NavBar";

function HomePatrocinios() {
	const [key, setKey] = useState(null); // Estado para la pestaña activa
	const [tipo_usuario, setTipo_usuario] = useState("");

	// Función que alterna la pestaña activa
	const handleTabSelect = (k) => {
		setKey((prevKey) => (prevKey === k ? null : k));
	};

	// sessionStorage.getItem("tipo_usuario");

	useEffect(() => {
		setTipo_usuario(sessionStorage.getItem("tipo_usuario"));
		// console.log(tipo_usuario);
	});
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

					<Tab eventKey="competencias" title="Competencias">
						{key === "competencias" && <Competencias setCurrentView={setKey} />}
					</Tab>

					{tipo_usuario == 2 && (
						<Tab eventKey="PatrociniosEquipo" title="Admin Perfil Equipo">
							{key === "PatrociniosEquipo" && (
								<PatrociniosEquipo setCurrentView={setKey} />
							)}
						</Tab>
					)}

					{tipo_usuario == 2 && (
						<Tab eventKey="PatrociniosPiloto" title="Admin Perfil Piloto">
							{key === "PatrociniosPiloto" && (
								<PatrociniosPiloto setCurrentView={setKey} />
							)}
						</Tab>
					)}
				</Tabs>
				<hr />
				<PatrociniosUsuario />{" "}
				{/* Componente de Patrocinios que se muestra debajo */}
			</div>
		</>
	);
}

export default HomePatrocinios;
