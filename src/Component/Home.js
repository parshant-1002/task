// libs
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Modal from "react-bootstrap/Modal";
// componets
import Table from "./Table";
import Modal1 from "./Modal1";

export default function Home() {

  const [show3, setShow3] = useState(false);
  const [event, setEvent] = useState(false);
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data")) || [];
    setData(data);
    setListData(data);
    const randomId = Math.floor(Math.random() * 1000);
    setId(randomId);
  }, []);


  useEffect(() => {
    if (data?.length) {
      localStorage.setItem("data", JSON.stringify(data))
    }
  }, [data]);

  function handleSureDelete() {
    const filteredData = data.filter((val) => !inputData.includes(val.id));
    setListData(filteredData);
    setData(filteredData);
    setInputData([]);
    setSearchData("");
    setShow3(false);
  }
  

  function search(e) {
    e.preventDefault();
    const event = e.target.value?.toLowerCase();
    setSearchData(event);
  
    const newData = data.filter((val) => (
      val.firstName?.toLowerCase().includes(event) ||
      val.lastName?.toLowerCase().includes(event) ||
      val.superHeroName?.toLowerCase().includes(event) ||
      val.age?.toString()?.toLowerCase().includes(event) ||
      val.email?.toLowerCase()?.includes(event) ||
      val.gender?.toLowerCase()?.includes(event)
    ));
  
    setListData(newData);
  }
  

  return (
    <>
      <div className=" p-5 mx-5 mt-5">
        <div className="d-flex justify-content-center w-100">
          <Modal1
            id={id}
            data={data}
            listData={listData}
            show={show}
            setEvent={setEvent}
            setData={setData}
            setId={setId}
            setShow={setShow}
            setListData={setListData}
            setSearchData={setSearchData}

          />
          <Modal show={show3} onHide={() => { setShow3(false); }} animation={true} >
            <div className='p-4 border border-black '>
              <div className='d-flex justify-content-center'>
                <h1 className='text-danger    px-4 py-2'>Sure to delete items</h1>
              </div>
              <div className='d-flex justify-content-center'>
                <button
                  className="btn btn-outline-danger mx-2 my-4 px-4 fa fa-bitbucket"
                  onClick={handleSureDelete}
                />
                <button
                  className="btn btn-outline-secondary mx-2 my-4 px-4 fa fa-times"
                  onClick={() => { setShow3(false); }} />
              </div>
            </div>
          </Modal>
        </div>
        <div className="d-flex px-5 mx-5  justify-content-end w-100" >
          {inputData.length ?
            <button
              className='mx-2 my-2 btn btn-outline-danger  px-4'
              onClick={() => { setShow3(true); }}
            >
              Delete
            </button>
            :
            <label
              className="px-4 py-2  m-1 bg-white border border-danger round rounded-2 text-danger ">
              Select to Delete
            </label>
          }
          <button
            className="mx-2 my-2 btn btn-outline-primary px-4 "
            onClick={() => { setShow(true); }}
          >
            Add Record
          </button>
          <input
            className="mx-2 my-2 px-2 round rounded-4  "
            placeholder="&#xf002; Search"
            style={{ fontFamily: "FontAwesome" }}
            onChange={search}
            value={searchData}
          />
        </div >
        <div className="d-flex justify-content-center w-100">
          <Table
            data={data}
            setData={setData}
            event={event}
            setListData={setListData}
            listData={listData}
            inputData={inputData}
            setInputData={setInputData}
          />
        </div>
      </div>




    </>
  );
}