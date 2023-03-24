import React from 'react'


import Header from '../../Components/Atoms/Header'
import Sidebar from '../Sidebar'
import "./styles.css"
import Chat from '../../Components/Cells/Chat'
export default function Home() {

  return (
    <div >

        <Header/>
        <div className='main'>

      
        <Sidebar/>

        <div className='content'>
      <Chat/>
        </div>
        </div>
    </div>
  )
}
