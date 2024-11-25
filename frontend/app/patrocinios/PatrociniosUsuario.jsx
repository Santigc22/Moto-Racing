"use client";

import React, { useEffect, useState } from "react";
import { datapostputdelget } from "../Components/Peticiones";
import PatrocinioCard from "./PatrocinioCard";
import "bootstrap/dist/css/bootstrap.min.css";

function PatrociniosUsuario() {
	const [patrocinios, setPatrocinios] = useState({
		patrocinios_equipos: [],
		patrocinios_pilotos: [],
		patrociniosMongoArray: [],
	});

	const fetchPatrocinios = async () => {
		try {
			const result = await datapostputdelget(
				"/patrocinios/patrocinios_usuario",
				"",
				"GET"
			);
			if (result.success) {
				setPatrocinios(result.data);
			}
		} catch (error) {
			console.error("Error al obtener los patrocinios:", error);
		}
	};

	useEffect(() => {
		fetchPatrocinios();
	}, []);

	const getPatrocinioDetails = (idPatrocinio) => {
		return (
			patrocinios.patrociniosMongoArray.find((p) => p._id === idPatrocinio) ||
			{}
		);
	};

	return (
		<div className="container">
			<h1 className="my-4">Patrocinios</h1>

			<h2>Patrocinios por Equipos</h2>
			<div className="row">
				{patrocinios.patrocinios_equipos.length > 0 ? (
					patrocinios.patrocinios_equipos.map((patrocinio) => {
						const patrocinioDetails = getPatrocinioDetails(
							patrocinio.id_patrocinio.replace(/"/g, "")
						);
						return (
							<div
								key={patrocinio.id_patrocinio}
								className="col-12 col-md-6 col-lg-4"
							>
								<PatrocinioCard
									key={patrocinio.id_patrocinio}
									patrocinio={{ ...patrocinio, ...patrocinioDetails }}
									tipo="equipo"
								/>
							</div>
						);
					})
				) : (
					<p>No hay patrocinios para equipos.</p>
				)}
			</div>
			<h2>Patrocinios por Pilotos</h2>
			<div className="row">
				{patrocinios.patrocinios_pilotos.length > 0 ? (
					patrocinios.patrocinios_pilotos.map((patrocinio) => {
						const patrocinioDetails = getPatrocinioDetails(
							patrocinio.id_patrocinio.replace(/"/g, "")
						);
						return (
							<div
								key={patrocinio.id_patrocinio}
								className="col-12 col-md-6 col-lg-4"
							>
								<PatrocinioCard
									key={patrocinio.id_patrocinio}
									patrocinio={{ ...patrocinio, ...patrocinioDetails }}
									tipo="piloto"
								/>
							</div>
						);
					})
				) : (
					<p>No hay patrocinios para pilotos.</p>
				)}
			</div>
		</div>
	);
}

export default PatrociniosUsuario;
