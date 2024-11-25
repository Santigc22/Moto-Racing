import React, { useEffect, useState } from "react";
import { datapostputdelget } from "../Components/Peticiones";
import PatrocinioCard from "./PatrocinioCard";

import "bootstrap/dist/css/bootstrap.min.css";
function PatrociniosEquipo() {
	const [partesEquipo, setPartesEquipo] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [parteSeleccionada, setParteSeleccionada] = useState(null);
	const [nuevoPrecio, setNuevoPrecio] = useState("");
	const [disponible, setDisponible] = useState(false);

	const [histPatrociniosEquipo, setHistPatrociniosEquipo] = useState({
		patrocinios_equipos: [],
		patrociniosMongoArray: [],
	});
	const partesEquipoPatrocinio = async () => {
		const response = await datapostputdelget(
			"/patrocinios/partes_equipo_usuario",
			null,
			"GET"
		);

		setPartesEquipo(response.partes);
	};

	const allPatrociniosEquipo = async () => {
		const response = await datapostputdelget(
			"/patrocinios/patrocinios_equipo",
			null,
			"GET"
		);

		setHistPatrociniosEquipo(response.data);
	};
	// Obtener partes del equipo
	useEffect(() => {
		partesEquipoPatrocinio();
		allPatrociniosEquipo();
	}, []);
	const getPatrocinioDetails = (idPatrocinio) => {
		return (
			histPatrociniosEquipo.patrociniosMongoArray.find(
				(p) => p._id === idPatrocinio
			) || {}
		);
	};
	// Abrir el modal para editar una parte
	const abrirModal = (parte) => {
		setParteSeleccionada(parte);
		setNuevoPrecio(parte.precio_parte);
		setDisponible(parte.parte_disponible.data[0] === 1);
		setModalVisible(true);
	};

	// Guardar los cambios de la parte
	const guardarCambios = async () => {
		// Enviar los datos actualizados al backend
		const response = await datapostputdelget(
			`/patrocinios/modificar_partes_equipo`,
			{
				precio: nuevoPrecio,
				is_enable: disponible ? 1 : 0,
				id_parte: parteSeleccionada.id_parte,
			},
			"PATCH"
		);

		if (response.success) {
			// Actualizar el estado local con los nuevos datos
			setPartesEquipo((prev) =>
				prev.map((parte) =>
					parte.id_parte === parteSeleccionada.id_parte
						? {
								...parte,
								precio_parte: nuevoPrecio,
								parte_disponible: { data: [disponible ? 1 : 0] },
						  }
						: parte
				)
			);
			setModalVisible(false);
		} else {
			console.error("Error al guardar los cambios");
		}
	};

	return (
		<div className="container mt-4">
			<h1 className="text-center mb-4">Partes del Equipo</h1>
			<table className="table table-striped table-bordered">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Descripción</th>
						<th>Precio</th>
						<th>Disponible</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{partesEquipo.map((parte) => (
						<tr key={parte.id_parte}>
							<td>{parte.nombre_parte}</td>
							<td>{parte.descripcion_parte}</td>
							<td>${parte.precio_parte}</td>
							<td>{parte.parte_disponible.data[0] === 1 ? "Sí" : "No"}</td>
							<td>
								<button
									className="btn btn-primary btn-sm"
									onClick={() => abrirModal(parte)}
								>
									Editar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Modal */}
			{modalVisible && (
				<div
					className="modal show d-block"
					tabIndex="-1"
					role="dialog"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Editar Parte</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setModalVisible(false)}
								></button>
							</div>
							<div className="modal-body">
								<div className="mb-3">
									<label className="form-label">Nuevo Precio:</label>
									<input
										type="number"
										className="form-control"
										value={nuevoPrecio}
										onChange={(e) => setNuevoPrecio(e.target.value)}
									/>
								</div>
								<div className="mb-3 form-check">
									<input
										type="checkbox"
										className="form-check-input"
										checked={disponible}
										onChange={(e) => setDisponible(e.target.checked)}
									/>
									<label className="form-check-label">Disponible</label>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-success"
									onClick={guardarCambios}
								>
									Guardar
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setModalVisible(false)}
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<h2>Patrocinios a mi Equipos</h2>
			<div className="row">
				{histPatrociniosEquipo.patrocinios_equipos.length > 0 ? (
					histPatrociniosEquipo.patrocinios_equipos.map((patrocinio) => {
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
					<p>Aun no te han patrocinado.</p>
				)}
			</div>
		</div>
	);
}

export default PatrociniosEquipo;
