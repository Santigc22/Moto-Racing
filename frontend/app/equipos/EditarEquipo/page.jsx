import React from 'react'
import EditarEquipo from './EditarEquipo'
import { Suspense } from 'react';

function page() {
  return (
    <div>
         <Suspense fallback={<p>Cargando...</p>}>
        <EditarEquipo />
        </Suspense>
    </div>
  )
}

export default page