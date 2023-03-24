import React, { useState } from 'react'
import "./styles.css"
import { useDispatch } from 'react-redux';
import { searchUser } from '../../../Redux/Action';
export default function Header() {
  const [search,setSearch]=useState("");

  
  return (
    <div className='Header'>
  
      <div className='SearchBar'>
         <label  className='Heading'>Slack</label>
        {/* <input className='searchinput' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="   ...search Channel and Chat"></input> */}
     
      </div>
    

    </div>
  )
}
