import React from 'react'
import Navbar from '../../Atoms/Navbar'
import "./styles.css"

export default function Header() {

  return (
    <div className='Header'>
      <label className='Heading'>Slack</label>
      <div className='Nav'>
        <Navbar />
      </div>
    </div>
  )
}
