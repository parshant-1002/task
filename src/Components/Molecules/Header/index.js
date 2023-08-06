// libs
import React from 'react'

// component
import Navbar from '../Navbar'

// styles
import "./styles.css"
import { TEXT } from '../../../Shared/Constants'

export default function Header() {
  return (
    <div className='Header'>
      <label className='Heading'>{TEXT.SLACK}</label>
      <div className='Nav'>
        <Navbar />
      </div>
    </div>
  )
}
