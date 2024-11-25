'use client'

import React from "react";
import NavBar from '../Components/NavBar'
import { useEffect, useState } from 'react';
import styles from "./page.module.css"
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Equipos() {
    const router = useRouter();

    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [teamNameFilter, setTeamNameFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newTeam, setNewTeam] = useState({
        nombre: '',
        representante_id: '',
        logo: null,
        extra_por_patrocinio: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await fetch(
                    `https://moto-racing.onrender.com/equipos?page=${currentPage}&resultsPerPage=${resultsPerPage}&teamName=${teamNameFilter}`
                );
                const data = await response.json();

                if (response.ok) {
                    setEquipos(data.equipos);
                    setTotalPages(data.totalPages);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Error al obtener los equipos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEquipos();
    }, [currentPage, resultsPerPage, teamNameFilter]);

    if (loading) {
        return <p>Cargando equipos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
    };

    const handleResultsPerPageChange = (e) => {
        setResultsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleTeamNameFilterChange = (e) => {
        setTeamNameFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleViewDetails = (equipoId) => {
        router.push(`/equipos/DetallesEquipo?id=${equipoId}`)
    };

    const handleAddTeam = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setNewTeam({
            nombre: '',
            representante_id: '',
            logo: null,
            extra_por_patrocinio: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeam((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNewTeam((prev) => ({
            ...prev,
            logo: e.target.files[0]
        }));
    };

    const handleEditTeam = (equipoId) => {
        router.push(`/equipos/EditarEquipo?id=${equipoId}`);
    };

    const handleSubmit = async () => {
        if (!newTeam.logo) {
            alert("Debe seleccionar una imagen.");
            return;
        }

        try {
            setSubmitting(true);
            
            // Subir imagen
            const formData = new FormData();
            formData.append("image", newTeam.logo);
            const imageResponse = await fetch("https://moto-racing.onrender.com/s3/upload/equipos", {
                method: "POST",
                body: formData
            });
            const imageResult = await imageResponse.json();

            if (!imageResponse.ok) {
                alert("Error al subir la imagen: " + imageResult.message);
                return;
            }

            const logo_id = imageResult.id_file_attacchment;

            // Crear equipo
            const teamResponse = await fetch("https://moto-racing.onrender.com/equipos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: newTeam.nombre,
                    representante_id: newTeam.representante_id,
                    logo_id,
                    extra_por_patrocinio: newTeam.extra_por_patrocinio
                })
            });

            const teamResult = await teamResponse.json();

            if (teamResponse.ok) {
                alert("Equipo creado exitosamente");
                setShowForm(false);
                setCurrentPage(1); // Recargar equipos
            } else {
                alert("Error al crear el equipo: " + teamResult.message);
            }
        } catch (error) {
            alert("Error en el proceso: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <NavBar />

            <h2 className={styles.title}>Listado de equipos</h2>

            {showForm ? (
                <div className={styles.formContainer}>
                    <h3>Crear Equipo</h3>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={newTeam.nombre}
                            onChange={handleInputChange}
                            maxLength={50}
                        />
                    </label>
                    <label>
                        Representante:
                        <input
                            type="number"
                            name="representante_id"
                            value={newTeam.representante_id}
                            onChange={handleInputChange}
                            maxLength={20}
                        />
                    </label>
                    <label>
                        Logo:
                        <input
                            type="file"
                            name="logo"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </label>
                    <label>
                        Extra por patrocinio:
                        <input
                            type="number"
                            name="extra_por_patrocinio"
                            value={newTeam.extra_por_patrocinio}
                            onChange={handleInputChange}
                            maxLength={2}
                        />
                    </label>
                    <button onClick={handleSubmit} disabled={submitting}>
                        Crear
                    </button>
                    <button onClick={handleCancel} disabled={submitting}>
                        Cancelar
                    </button>
                </div>
            ) : (
                <button onClick={handleAddTeam} className={styles.addButton}>
                    Agregar Nuevo Equipo
                </button>
            )}

            {/* Filtros y listado de equipos */}
            <div>
                <label htmlFor="teamNameFilter">Filtro nombre de equipo</label>
                <input 
                type="text" 
                id="teamNameFilter"
                value={teamNameFilter}
                onChange={handleTeamNameFilterChange}
                placeholder="Nombre del equipo"
                />
            </div>

            <div>
                <label htmlFor="resultsPerPage">Equipos por página:</label>
                <select
                    id="resultsPerPage"
                    value={resultsPerPage}
                    onChange={handleResultsPerPageChange}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className={styles['cards-container']}>
                {equipos.map((equipo) => (
                    <div key={equipo.id} className={styles.card}>
                        <h3>{equipo.nombre}</h3>
                        <button onClick={() => handleViewDetails(equipo.id)} className={styles.iconButton}>
                            <FaSearch />
                        </button>
                        <button onClick={() => handleEditTeam(equipo.id)} className={styles.iconButton}>
        Editar
    </button>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}
