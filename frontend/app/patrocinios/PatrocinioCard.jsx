"use client";

import React, { useState } from "react";

function PatrocinioCard({ patrocinio, tipo }) {
	const [showParts, setShowParts] = useState(false);
	const isEquipo = tipo === "equipo";

	const toggleShowParts = () => setShowParts(!showParts);

	return (
		<div className="card my-3">
			<div className="card-header">
				<h5 className="card-title">
					Patrocinio {isEquipo ? "Equipo" : "Piloto"}
				</h5>
			</div>
			<div className="card-body">
				<p>
					<strong>ID Patrocinador:</strong> {patrocinio.id_patrocinador}
				</p>
				<p>
					<strong>ID Patrocinio:</strong> {patrocinio.id_patrocinio}
				</p>
				<p>
					<strong>{isEquipo ? "ID Equipo" : "ID Piloto"}:</strong>{" "}
					{isEquipo ? patrocinio.id_equipo : patrocinio.id_piloto}
				</p>
				<p>
					<strong>Total:</strong> ${patrocinio.total}
				</p>

				{patrocinio.partes_patrocinio && (
					<div className="mt-3">
						<button
							className="btn btn-secondary btn-sm"
							onClick={toggleShowParts}
						>
							{showParts
								? "Ocultar Partes Patrocinio"
								: "Ver Partes Patrocinio"}
						</button>
						{showParts && (
							<div className="mt-3">
								<h6>Detalles de Partes Patrocinadas:</h6>
								<ul className="list-group">
									{patrocinio.partes_patrocinio.map((parte) => (
										<li
											key={parte.id_parte}
											className="list-group-item d-flex justify-content-between align-items-center"
										>
											<span>{parte.nombre}</span>
											<span className="badge bg-primary">${parte.precio}</span>
										</li>
									))}
								</ul>
								<p className="mt-2">
									<strong>Subtotal:</strong> ${patrocinio.subtotal}
								</p>
								<p>
									<strong>Porcentaje de Aumento:</strong>{" "}
									{patrocinio.porcentaje_aumento_entidad}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default PatrocinioCard;
