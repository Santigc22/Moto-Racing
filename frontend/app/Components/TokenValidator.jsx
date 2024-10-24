'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function TokenValidator() {

    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem('authToken');
        console.log(token)
      if (!token) {
        router.push('/'); 
      }
    }, [router]);

  return (
    <>
    </>
  )
}

export default TokenValidator