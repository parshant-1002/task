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
        setErr("---not present---")
      })
      ;
  }, [])

  function search(value) {
    const newCity = cityList.filter(val => val.toLowerCase().includes(value.toLowerCase()))
    setFilterCity(newCity)
    setCity(value)
    setCondition(true)
  }



  return (
    <div className=" justify-content-end w-100">
      <div className=" p-4 row-2'">
        <div className=" column ">
          <div className=" justify-content-end w-100">
            <button className="btn btn-dark p-2 mb-2 " onClick={() => back('/')}>Select Country</button>
          </div>
          <h1 className="p-3 round rounded-2  bg-warning">Cities of {country} are:</h1>
          <input placeholder='Enter city name' onChange={(e) => search(e.target.value)} value={city}></input>

          {condition ? filterCity.map(val => <li className="p-2 m-2 text-white  round rounded-4 border border-dark bg-success">{val}</li>) : cityList.map(val => <li className="p-2 m-2 text-white  round rounded-4 border border-dark bg-success">{val}</li>)}
          <h2 className='text-danger'>{err} </h2>
        </div>
      </div>
    </div>
  )

}
