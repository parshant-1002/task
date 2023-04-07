import React, { useContext, useEffect } from 'react'


import Header from '../../Components/Cells/Header'
import Sidebar from '../Sidebar'
import "./styles.css"
import Chat from '../../Components/Cells/ChatSection'
import { AuthContext } from '../../Context/AuthContext'


export default function Home() {
  const { currentUser } = useContext(AuthContext);
useEffect(()=>{  if(!currentUser){
  window.location.reload();}},[])

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
