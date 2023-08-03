// libs
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// consts
import { API, BUTTON_TEXT, MESSAGES, STRINGS } from '../shared/Constants'

export default function Countries() {
    const navigate = useNavigate()

    const [country, setCountry] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [errMsg, setErrMsg] = useState("")

    useEffect(() => {
        getData()
    }, [])

    const handleKeyDownforSubmit = (event) => {
        if (event.key === 'Enter') {
            handleClickNext()
        }
    };

    function handleClickNext() {
        if (!selectedCountry) {
            setErrMsg(MESSAGES.SELECT_COUNTRY)
        }
        navigate(`/${selectedCountry}`)
    }




    function getData() {
        fetch(API.COUNTRY)
            .then((response) => response.json())
            .then((val) => setCountry(val.data))
            .catch((errro) => {
                setErrMsg(MESSAGES.ERROR_IN_FETCHING_COUNTRIES)
            })

    }

    function handleSubmit(event) {
        const selectedCountryName = event.target.value;
        setSelectedCountry(selectedCountryName);
    }

    return (
        <>
            <div className="p-5 px-5 mx-5  justify-content-center">
                <div>
                    <h1
                        className="p-2  round rounded-2  bg-white border border-info  w-100">
                        {STRINGS.SELECT_COUNTRY}
                    </h1>
                </div>
                <div>
                    <select
                        className="form-select-lg border border-info "
                        onKeyDown={handleKeyDownforSubmit}
                        onChange={handleSubmit}
                    >
                        <option>select country</option>
                        {country.map((val) => (
                            <option
                                key={val}
                            >
                                {val.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-info mx-2 "
                        onClick={handleClickNext}
                    >
                        {BUTTON_TEXT.NEXT}
                    </button>
                </div>
                <div>
                    <h1
                        className=" px-5 text-warning"
                    >
                        {errMsg}
                    </h1>
                </div>
            </div>

        </>
    )
}
