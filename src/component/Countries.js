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
            <div className="p-5">
                <h1 className="p-2  round rounded-2 text-white bg-danger">Select country</h1>
                <select onKeyDown={handleKeyDownforSubmit} onChange={(e) => handleSubmit(e.target.value)} >
                    <option>select country</option>
                    {country.map((val) => <option >{val.name}</option>)}
                </select>
                <button className="btn btn-success" onClick={() => next()}>Next</button>
                <div>
                    <h1>{err}</h1>
                </div>
            </div>

        </>
    )
}
