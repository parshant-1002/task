import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useParams, useNavigate } from 'react-router-dom'

export default function Cities() {
  const { country } = useParams();
  const [cityList, setcityList] = useState([]);
  const [city, setCity] = useState("")
  const [err, setErr] = useState("")
  const [filterCity, setFilterCity] = useState([])
  const [condition, setCondition] = useState(false)
  const back = useNavigate()

  useEffect(() => {
    axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
      country: country
    })
      .then((val) => setcityList(val.data?.data || []))
      .catch((errro) => {
        setErr("---not present")
      })
  }, [])


  useEffect(() => {
    const debounce = setTimeout(() => setList(city), 400)
    return () => clearTimeout(debounce)
  }
    , [city])

  function setList(city) {
    const newCity = cityList.filter(val => val.toLowerCase().includes(city.toLowerCase()))
    setFilterCity(newCity)
  }

  function search(value) {
    setCity(value)
    setCondition(true)
  }



  return (
    <div className=" justify-content-center w-100">
      <div className="px-5 mx-5 pt-5 w">
        <h1 className="p-2  round rounded-2  bg-white border border-warning w-100">Cities of {country} are:</h1>
        <input className='w-25 border border-warning round rounded-2  p-2' placeholder='Enter city name' onChange={(e) => search(e.target.value)} value={city}></input>
        <button className="btn btn-warning py-2  mx-2 mb-1 " onClick={() => back('/')}>Back</button>
      </div>
      <div className='   mx-5  w-100 justify-content-center'>
        {condition ? filterCity.map(val => <h3 className="px-5 mx-5 w-25 text-center text-white border border-white round rounded-4   " >{val}</h3>) : cityList.map(val => <h3 className="px-5 mx-5 w-25 text-center text-white border border-white round rounded-4  ">{val}</h3>)}
      </div>
      <h2 className='mx-5 px-5 text-warning'>{err} </h2>
      {cityList.length == 0 && !err ? <h2 className='mx-5 px-5 text-warning'>Loading...</h2> : null}
      {filterCity.length == 0 && city ? <h2 className='mx-5 px-5 text-warning'>*not present*</h2> : null}
    </div>
  )
}
