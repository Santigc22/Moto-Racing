import React from 'react'
import Dasboard from './Dashboard'
import TokenValidator from '../Components/TokenValidator'

function page() {
  return (
    <div>

    <TokenValidator />
    <Dasboard />

    </div>
  )
}

export default page