import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Countries() {

    const [country, setCountry] = useState([])
    const [current, setCurrent] = useState("")
    const [err, setErr] = useState("")
    const nextPage = useNavigate()

    useEffect(() => { getData() }, [])

    const handleKeyDownforSubmit = (event) => {
        if (event.key === 'Enter') {
            next()
        }
    };

    function next() {
        if (current == "") {
            setErr("...Select the country first")
        }
        nextPage(`${current}`)
    }




    function getData() {
        fetch("https://countriesnow.space/api/v0.1/countries/capital ").then((response) => response.json())
            .then((val) => setCountry(val.data))
            .catch((errro) => {
                setErr("Error")
            })

    }

    function handleSubmit(e) {
        setCurrent(e)
    }

    return (
        <>
            <div className="p-5 px-5 mx-5  justify-content-center">
                <div>
                    <h1 className="p-2  round rounded-2  bg-white border border-info  w-100">Select country</h1>
                </div>
                <div>
                    <select className="form-select-lg border border-info " onKeyDown={handleKeyDownforSubmit} onChange={(e) => handleSubmit(e.target.value)} >
                        <option>select country</option>
                        {country.map((val) => <option >{val.name}</option>)}
                    </select>
                    <button className="btn btn-info mx-2 " onClick={() => next()}>Next</button>
                </div>
                <div>
                    <h1 className=" px-5 text-warning">{err}</h1>
                </div>
            </div>

        </>
    )
}
