import React from 'react'
import Chats from '../../Components/Cells/Chats'
import Navbar from '../../Components/Cells/Navbar'
import Search from '../../Components/Cells/search'
import "./styles.css"
export default function Sidebar
() {
  return (
    <div className='sidebar'>
        <Navbar/>
        <Search/>
        <Chats/>
    </div>
  )
}
