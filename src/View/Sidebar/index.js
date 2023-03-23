import React from 'react'
import Navbar from '../../Components/Cells/Navbar'
import Search from '../../Components/Cells/search'
import "./styles.css"
export default function Sidebar
() {
  return (
    <div className='sidebar'>
        <Navbar/>
        <Search/>

    </div>
  )
}
