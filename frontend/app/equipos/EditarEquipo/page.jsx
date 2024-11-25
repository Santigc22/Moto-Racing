'use client'

import React, { useEffect, useState } from 'react';
import NavBar from '@/app/Components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "../page.module.css";

export default function EditarEquipo() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const equipoId = searchParams.get('id');

    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nombre, setNombre] = useState('');
    const [representanteId, setRepresentanteId] = useState('');
    const [extra, setExtra] = useState('');

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await fetch(`https://moto-racing.onrender.com/equipos/${equipoId}`);
                const data = await response.json();
                console.log('Respuesta de la API:', data);

                if (response.ok) {
                    setEquipo(data);
                    setNombre(data.nombre || '');
                    setRepresentanteId(data.representante_id || '');
                    setExtra(data.extra || '');
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Error al cargar los datos del equipo.');
            } finally {
                setLoading(false);
            }
        };

        fetchEquipo();
    }, [equipoId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://moto-racing.onrender.com/equipos/${equipoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(nombre && { nombre }),
                    ...(representanteId && { representante_id: representanteId }),
                    ...(extra && { extra_por_patrocinio: extra }),
                }),
            });

            if (response.ok) {
                alert('Equipo actualizado correctamente.');
                router.push('/equipos');
            } else {
                const data = await response.json();
                alert(`Error al actualizar el equipo: ${data.message}`);
            }
        } catch (error) {
            alert('Error al actualizar el equipo.');
        }
    };

    if (loading) return <p>Cargando datos del equipo...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <NavBar />
            <h2 className={styles.title}>Editar Equipo</h2>
            <form className={styles.form} onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="nombre">Nombre del equipo:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="representanteId">ID del representante:</label>
                    <input
                        type="text"
                        id="representanteId"
                        value={representanteId}
                        onChange={(e) => setRepresentanteId(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="extra">Extra por patrocinio:</label>
                    <input
                        type="text"
                        id="extra"
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.updateButton}>
                    Actualizar Equipo
                </button>
            </form>
        </div>
    );
}