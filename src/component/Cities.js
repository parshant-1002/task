// libs
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { API, BUTTON_TEXT, MESSAGES, STRINGS } from '../shared/Constants';

// consts

export default function Cities() {
  const { country } = useParams();
  const navigate = useNavigate();

  const [cityList, setCityList] = useState([]);
  const [searchedCity, setSearchedCity] = useState("");
  const [err, setErr] = useState("");
  const [filterCity, setFilterCity] = useState([]);

  useEffect(() => {
    axios.post(API.CITIES, {
      country: country,
    })
      .then((val) => {
        setCityList(val?.data?.data || []);
        setFilterCity(val?.data?.data || []);
      })
      .catch((errro) => {
        setErr(MESSAGES.CITIES_NOT_PRESENT);
      });
  }, [])


  useEffect(() => {
    const debounce = setTimeout(() => handleFilterCities(searchedCity), 400);
    return () => clearTimeout(debounce);
  }, [searchedCity])

  function handleFilterCities(searchedCity) {
    const newCity = cityList
      ?.filter((val) => (val.toLowerCase().includes(searchedCity.toLowerCase())));
    if (searchedCity) {
      setFilterCity(newCity);
    } else {
      setFilterCity(cityList);
    }
  }

  function handleSearchCity(event) {
    const searchedCityName = event.target.value
    setSearchedCity(searchedCityName);
  }

  return (
    <div className=" justify-content-center w-100">
      <div className="px-5 mx-5 pt-5 w">
        <h1
          className="p-2  round rounded-2  bg-white border border-warning w-100">
          {STRINGS.CITIES_OF_COUNTRY(country)}
        </h1>
        <input
          className='w-25 border border-warning round rounded-2  p-2'
          placeholder='Enter city name'
          onChange={handleSearchCity}
          value={searchedCity}
        />
        <button
          className="btn btn-warning py-2  mx-2 mb-1 "
          onClick={() => navigate('/')}
        >
          {BUTTON_TEXT.BACK}
        </button>
      </div>
      <div
        className=' mx-5  w-100 justify-content-center'>
        {(filterCity?.length) ? filterCity
          ?.map((city) => (
            <h3
              key={city}
              className="px-5 mx-5 w-25 text-center text-white border border-white round rounded-4  " >
              {city}
            </h3>
          ))
          :
          null
        }
      </div>
      <h2
        className='mx-5 px-5 text-warning'>
        {err}
      </h2>
      {(!cityList?.length && !err) ?
        <h2 className='mx-5 px-5 text-warning'>
          {MESSAGES.LOADING}
        </h2>
        :
        null}
      {(!filterCity?.length && searchedCity)
        ?
        <h2 className='mx-5 px-5 text-warning'>
          {MESSAGES.NOT_PRESENT}
        </h2>
        :
        null}
    </div>
  )
}
