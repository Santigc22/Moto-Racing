"use client";
import React, { useEffect, useState } from "react";
import {
	datapostputdelget,
	datapostputdelgetNOJSON,
} from "../Components/Peticiones";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

function Equipos({ setCurrentView }) {
	const [listaEquipos, setListaEquipos] = useState([]);
	const [partsEquiposPatrocinios, setPartsEquiposPatrocinios] = useState([]);
	const [partesSeleccionadas, setPartesSeleccionadas] = useState([]);
	const [equipo_id, setEquipo_id] = useState("");
	const [logo_id, setLogo_id] = useState(null);
	const [porcentaje_aumento_entidad, setPorcentaje_aumento_entidad] =
		useState(0);
	const porcentaje_default = 0;
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [datosFinales, setDatosFinales] = useState(null); // Cambiado a null inicialmente
	const router = useRouter(); // Obtener el router
	// Obtener lista de equipos
	const getEquipos = async () => {
		try {
			const result = await datapostputdelget("/equipos", "", "GET");
			if (result) {
				setListaEquipos(result.equipos);
			}
		} catch (error) {
			console.error("Error en la solicitud:", error);
		}
	};

	// Obtener partes del equipo seleccionado
	const getPartesPatrocinioEquipo = async () => {
		try {
			const result = await datapostputdelget(
				`/patrocinios/partes_equipo/${equipo_id}`,
				"",
				"GET"
			);
			if (result && result.data && result.data.partes) {
				setPartsEquiposPatrocinios(result.data.partes);
			}
		} catch (error) {
			console.error("Error en la solicitud:", error);
		}
	};

	// Manejar selección de imagen y mostrar previsualización
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setPreviewUrl(previewUrl);
		}
	};

	// Subir la imagen
	const handleUploadImage = async () => {
		if (!selectedFile) {
			alert("Por favor, selecciona un archivo primero.");
			return null;
		}

		if (selectedFile.name.length > 50) {
			alert("El nombre del archivo no puede ser mayor a 50 caracteres.");
			return null;
		}

		const formData = new FormData();
		formData.append("image", selectedFile);
		try {
			const response = await datapostputdelgetNOJSON(
				`/s3/upload/patrocinios`,
				formData,
				"POST"
			);
			if (response && response.id_file_attacchment) {
				setUploadStatus("Archivo subido con éxito.");
				setLogo_id(response.id_file_attacchment);
				return response.id_file_attacchment;
			} else {
				setUploadStatus(`Error: ${response.message || "Error desconocido"}`);
				return null;
			}
		} catch (error) {
			console.error("Error al subir el archivo:", error);
			setUploadStatus("Error al subir el archivo.");
			return null;
		}
	};

	// Manejar la selección de equipo
	const handleEquipoChange = (e) => {
		const selectedEquipoId = e.target.value;
		setEquipo_id(selectedEquipoId);
		const equipoSeleccionado = listaEquipos.find(
			(equipo) => equipo.id === parseInt(selectedEquipoId)
		);
		const porcentaje =
			equipoSeleccionado?.extra_por_patrocinio || porcentaje_default;
		setPorcentaje_aumento_entidad(parseFloat(porcentaje));
	};

	// Manejar la selección de partes
	const handlePartesSeleccionadas = (event) => {
		const selectedOptions = Array.from(event.target.selectedOptions, (option) =>
			parseInt(option.value)
		);
		setPartesSeleccionadas(selectedOptions);
	};

	// Actualizar datos finales cuando las partes seleccionadas cambian
	useEffect(() => {
		if (partesSeleccionadas.length > 0) {
			const partesPatrocinio = partesSeleccionadas
				.map((parteId) => {
					const parte = partsEquiposPatrocinios.find(
						(p) => p.id_parte === parteId
					);
					return parte
						? {
								id_parte: parte.id_parte,
								nombre: parte.nombre_parte,
								precio: parseFloat(parte.precio_parte),
						  }
						: null;
				})
				.filter(Boolean); // Eliminar partes nulas

			const subtotal = calcularSubtotal(partesPatrocinio);
			const total = calcularTotal(subtotal);

			// Actualizar el estado de datosFinales
			setDatosFinales({
				partes_patrocinio: partesPatrocinio,
				subtotal,
				porcentaje_aumento_entidad: `${porcentaje_aumento_entidad}%`,
				total,
			});
		} else {
			setDatosFinales(null); // Si no hay partes seleccionadas, establecer a null
		}
	}, [
		partesSeleccionadas,
		partsEquiposPatrocinios,
		porcentaje_aumento_entidad,
	]);

	// Calcular subtotal y total
	const calcularSubtotal = (partesPatrocinio) => {
		return partesPatrocinio.reduce((subtotal, parte) => {
			return subtotal + (parte ? parseFloat(parte.precio) : 0);
		}, 0);
	};

	const calcularTotal = (subtotal) => {
		const aumento = subtotal * (porcentaje_aumento_entidad / 100);
		return subtotal + aumento;
	};

	// Cargar equipos al inicio
	useEffect(() => {
		getEquipos();
	}, []);

	// Obtener partes cuando el equipo es seleccionado
	useEffect(() => {
		setPartsEquiposPatrocinios([]);
		setPartesSeleccionadas([]);
		if (equipo_id) {
			getPartesPatrocinioEquipo();
		}
	}, [equipo_id]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const uploadedLogoId = await handleUploadImage();
		if (!uploadedLogoId) {
			return; // Si falla la subida, no continuar
		}

		const datosFinalesSubmit = {
			id_entidad: parseInt(equipo_id),
			logo_id: uploadedLogoId,
			partes_patrocinio: datosFinales?.partes_patrocinio || [],
			subtotal: datosFinales?.subtotal || 0,
			porcentaje_aumento_entidad: `${porcentaje_aumento_entidad}%`,
			total: datosFinales?.total || 0,
		};

		try {
			const result = await datapostputdelget(
				"/patrocinios/create_patrocinio_equipo",
				[datosFinalesSubmit],
				"POST"
			);

			if (result) {
				alert("Patrocinio guardado con éxito");
				setCurrentView(""); // Cambia a la vista inicial
				return router.push("/patrocinios");
			}
		} catch (error) {
			console.error("Error en la solicitud:", error);
		}
	};

	return (
		<>
			<form className="container mt-4" onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="equipos" className="form-label">
						Equipos
					</label>
					<select
						className="form-select"
						value={equipo_id}
						onChange={handleEquipoChange}
					>
						<option value="" defaultValue>
							Seleccione un equipo
						</option>
						{listaEquipos.map((equipo) => (
							<option key={equipo.id} value={equipo.id}>
								{equipo.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<input type="file" onChange={handleFileChange} />
				</div>

				{previewUrl && (
					<div className="mb-3">
						<img
							src={previewUrl}
							alt="Previsualización"
							style={{ width: "200px" }}
						/>
					</div>
				)}

				<div className="mb-3">
					<label htmlFor="partes" className="form-label">
						Partes en las que quieres que salga tu publicidad
					</label>
					<select
						className="form-select"
						multiple
						value={partesSeleccionadas}
						onChange={handlePartesSeleccionadas}
					>
						<option value="" disabled hidden={equipo_id === ""}>
							Selecciona un equipo
						</option>
						{partsEquiposPatrocinios.map((parte) => (
							<option key={parte.id_parte} value={parte.id_parte}>
								{parte.nombre_parte} - ${parte.precio_parte}
							</option>
						))}
					</select>
				</div>

				{/* Verifica si datosFinales no es nulo antes de mostrar la tabla */}
				{datosFinales && (
					<div className="container mt-4">
						<h3>Partes seleccionadas</h3>
						<table className="table table-striped">
							<thead>
								<tr>
									<th scope="col">Nombre de la Parte</th>
									<th scope="col">Precio</th>
								</tr>
							</thead>
							<tbody>
								{datosFinales.partes_patrocinio.map((parte) => (
									<tr key={parte.id_parte}>
										<td>{parte.nombre}</td>
										<td>${parte.precio.toFixed(2)}</td>
									</tr>
								))}
							</tbody>
						</table>

						<div className="mt-4">
							<h4>Resumen de Totales</h4>
							<table className="table">
								<tbody>
									<tr>
										<td>
											<strong>Subtotal:</strong>
										</td>
										<td>${datosFinales.subtotal.toFixed(2)}</td>
									</tr>
									<tr>
										<td>
											<strong>Porcentaje de aumento:</strong>
										</td>
										<td>{datosFinales.porcentaje_aumento_entidad}</td>
									</tr>
									<tr>
										<td>
											<strong>Total:</strong>
										</td>
										<td>${datosFinales.total.toFixed(2)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				<button type="submit" className="btn btn-primary">
					Guardar Patrocinio
				</button>
			</form>
		</>
	);
}

export default Equipos;
