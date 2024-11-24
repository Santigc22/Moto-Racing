'use client'

import React from "react";
import NavBar from '../Components/NavBar'
import { useEffect, useState } from 'react';
import styles from "./page.module.css"
import { FaSearch } from 'react-icons/fa';

export default function Equipos() {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [teamNameFilter, setTeamNameFilter] = useState('');

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

    };

    const handleAddTeam = () => {

    };

    return (
        <div>

            <NavBar />

            <h2 classname={styles.title}>Listado de equipos</h2>

            <button onClick={handleAddTeam} className={styles.addButton}>
                Agregar Nuevo Equipo
            </button>

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
