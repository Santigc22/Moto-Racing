import React from 'react'
import DetallesEquipo from './DetallesEquipo'
import { Suspense } from 'react';

function page() {
  return (
    <div>

        <Suspense fallback={<p>Cargando...</p>}>
            <DetallesEquipo />
        </Suspense>

    </div>
  )
}

export default page