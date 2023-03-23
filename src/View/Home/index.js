import React from 'react'
import Content from '../../Components/Cells/Content'
import Header from '../../Components/Cells/Header'
import Sidebar from '../Sidebar'
import "./styles.css"
export default function Home() {
  return (
    <div >

        <Header/>
        <div className='main'>

      
        <Sidebar/>

        <div className='content'>

        <Content/>
        </div>
        </div>
    </div>
  )
}
