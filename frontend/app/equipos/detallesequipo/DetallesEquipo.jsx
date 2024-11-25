'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';



function DetallesEquipo() {
    const router = useRouter();
    const searchParams = useSearchParams();


    const equipoId = searchParams.get('id');

    const [equipo, setEquipo] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await fetch(`https://moto-racing.onrender.com/equipos/${equipoId}`);
                const data = await response.json();

                if (response.ok) {
                    setEquipo(data.equipo);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Error al obtener los detalles del equipo.');
            }
        };

        if (equipoId) {
            fetchEquipo();
        }
    }, [equipoId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!equipo) {
        return <p>Cargando detalles del equipo...</p>;
    }

    return (
        <div>
            <button onClick={() => router.push('/equipos')}>Volver</button>
            <h1>Detalles del Equipo</h1>
            <p><strong>ID:</strong> {equipo.id}</p>
            <p><strong>Nombre:</strong> {equipo.nombre}</p>
            <p><strong>Representante:</strong> {equipo.representante_nombre}</p>
            <p><strong>Logo:</strong> {equipo.logo_path}</p>
            <p><strong>Extra por Patrocinio:</strong> {equipo.extra_por_patrocinio}</p>
        </div>
    );
}

export default DetallesEquipo