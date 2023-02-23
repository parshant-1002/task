import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function Cities() {
  const { countrydata } = useParams();
  const [citylist, setcitylist] = useState([]);
  const [city, setCity] = useState("")
  const [err, setErr] = useState("")
  const [filterCity, setFilterCity] = useState([])
  const [condition, setCondition] = useState(false)

  useEffect(() => {
    function get() {
      axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: countrydata
      })
        .then((val) => setcitylist(val.data?.data || []))
        .catch((errro) => {

          if (errro.response.status == 500) {
            setErr("---not present---")
          }
        })
        ;
    }

    get();
  }, [])
  let d = [...citylist]
  function search(e) {
    const newcity = d.filter(val => val.toLowerCase().includes(e.toLowerCase()) || val.toUpperCase().includes(e.toUpperCase()))
    setFilterCity(newcity)
    setCity(e)
    setCondition(true)
  }



  return (
    <div className=" justify-content-end w-100">
      <div className=" p-4 row-2'">
        <div className=" column      ">
          <div className=" justify-content-end w-100">


            <Link to="/">
              <button className="btn btn-dark p-2 mb-2 ">Select Country</button>
            </Link>
          </div>
          <h1 className="p-3 round rounded-2  bg-warning">Cities of {countrydata} are:</h1>
          <input placeholder='Enter city name' onChange={(e) => search(e.target.value)} value={city}></input>

          {condition ? filterCity.map(val => <li className="p-2 m-2 text-white  round rounded-4 border border-dark bg-success">{val}</li>) : citylist.map(val => <li className="p-2 m-2 text-white  round rounded-4 border border-dark bg-success">{val}</li>)}
          <h2 className='text-danger'>{err} </h2>
        </div>
      </div>
    </div>
  )

}
