import React, { useContext, useEffect } from 'react'


import Header from '../../Components/Cells/Header'
import Sidebar from '../Sidebar'
import "./styles.css"
import Chat from '../../Components/Cells/ChatSection'



export default function Home() {



  return (
    <div >
      <Header />
      <div className='main'>
        <Sidebar />
        <div className='content'>
          <Chat />
        </div>
      </div>
    </div>
  )
}
