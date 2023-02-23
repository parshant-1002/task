import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'





export default function Countries() {

    

    const [country, setCountry] = useState([])
    const [current, setCurrent] = useState("")


    useEffect(() => { getdata() }, [])
   

    const nextpage = useNavigate()

    const handleKeyDownforSubmit = (event) => {
        if (event.key === 'Enter') {
          next1()
        }
      };

    function next1(){
        
        nextpage(`${current}`)
    }




    function getdata() {
        fetch("https://countriesnow.space/api/v0.1/countries/capital ").then((response) => response.json())
            .then((val) => setCountry(val.data));
            
    }

console.log(country)

    function go(e) {
       
        setCurrent(e)

    }




    return (
        <>
        <div className="p-5">
            <h1 className="p-2  round rounded-2 text-white bg-danger">Select country</h1>
            <select onKeyDown={handleKeyDownforSubmit} onChange={(e) => go(e.target.value)} >
                <option>select country</option>
                {country.map((val) => <option >{val.name}</option>)}
            </select>
            <button className="btn btn-success" onClick={() => next1()}>Next</button>
           
        </div>
           
        </>
    )
}
