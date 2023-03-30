import React, { useState } from 'react'
import Navbar from '../../Atoms/Navbar'
import "./styles.css"
// import { useDispatch } from 'react-redux';
// import { searchUser } from '../../../Redux/Action';
export default function Header() {


  
  return (
    <div className='Header'>
  
   
         <label  className='Heading'>Slack</label>
        {/* <input className='searchinput' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="   ...search Channel and Chat"></input> */}
     <div className='Nav'>

     <Navbar/>
     </div>
     

    </div>
  )
}
