// libs
import React from 'react'

// components
import Header from '../../Components/Molecules/Header'
import Chat from '../../Components/Molecules/ChatSection'
import Sidebar from '../Sidebar'

// styles
import "./styles.css"

export default function Home() {
  return (
    <>
      <Header />
      <div className='main'>
        <div className='sideDiv'>
          <Sidebar />
        </div>
        <div className='content'>
          <Chat />
        </div>
      </div>
    </>
  )
}
