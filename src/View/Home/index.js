import React, { useContext, useEffect } from 'react'


import Header from '../../Components/Cells/Header'
import Sidebar from '../Sidebar'
import "./styles.css"
import Chat from '../../Components/Cells/ChatSection'
import { AuthContext } from '../../Context/AuthContext'


export default function Home() {
  const { currentUser } = useContext(AuthContext);
 

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
