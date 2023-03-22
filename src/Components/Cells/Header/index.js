import React, { useState } from 'react'
import "./styles.css"
export default function Header() {
  const [search,setSearch]=useState();
  return (
    <div className='Header'>
  
      <div className='SearchBar'>

        <input className='searchinput' value={search} onChange={(e)=>setSearch(e.target.value)}></input>
      </div>
    

    </div>
  )
}
