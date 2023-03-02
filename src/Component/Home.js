import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Modal from "react-bootstrap/Modal";

import Table from "./Table";
import Modal1 from "./Modal1";


export default function Home() {

  
  const [cnd, setCnd] = useState(true);

  const [show3, setShow3] = useState(false);
  const [event, setEvent] = useState(false);
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [listData, setListData] = useState([]);



  useEffect(() => {
    let x=JSON.parse(localStorage.getItem("data"));
    if(!x){
      localStorage.setItem("data", JSON.stringify([]));
     
    }
    setData(JSON.parse(localStorage.getItem("data")));
    setListData(JSON.parse(localStorage.getItem("data")))
    const dta=Math.floor(Math.random()*1000);

  setId(dta)
  }, []);


  useEffect(() => {
    !cnd? localStorage.setItem("data", JSON.stringify(data)):setCnd(false);
  
  }, [data, cnd]);

  
  

  function handleSureDelete(){
    setListData(data.filter((val) => !inputData.includes(val.id)));
    setData(data.filter((val) => !inputData.includes(val.id)));

    setInputData([]);
    setSearchData("");
    setShow3(false);
    
  }
  function search(e) {
    e.preventDefault();
    const event = e.target.value;
    setSearchData(event);
    const newData = data.filter(val => val.firstName.toLowerCase().includes(event.toLowerCase()) ||
      val.lastName.toLowerCase().includes(event.toLowerCase()) ||
      val.superHeroName.toLowerCase().includes(event.toLowerCase()) ||
      val.age.toLowerCase().includes(event.toLowerCase()) ||
      val.email.toLowerCase().includes(event.toLowerCase()) ||
      val.gender.toLowerCase().includes(event.toLowerCase())
    );
   
      if(e.target.value.length>0){
      setListData(newData);
      }
      else if(e.target.value.length==0){
        setListData(data);
      }
   
    
  }

 


  return (
    <>
      <div className=" p-5 mx-5 mt-5">
        <div className="d-flex justify-content-center w-100">


          <Modal1 id={id} data={data} listData={listData} show={show} setEvent={setEvent} setData={setData} setId={setId} setShow={setShow} setListData={setListData} setSearchData={setSearchData}/>
          <Modal show={show3} onHide={() => {setShow3(false);}} animation={true} >
            <div className='p-4 border border-black '>

              <div className='d-flex justify-content-center'>

                <h1 className='text-danger    px-4 py-2'>Sure to delete items</h1>
              </div>
              <div className='d-flex justify-content-center'>
                <button className="btn btn-outline-danger mx-2 my-4 px-4 fa fa-bitbucket" onClick={handleSureDelete}></button>
      
                <button className="btn btn-outline-secondary mx-2 my-4 px-4 fa fa-times" onClick={() => {setShow3(false);}}></button>
              </div>
            </div>
          </Modal>
        
        

        </div>
        <div className="d-flex px-5 mx-5  justify-content-end w-100" >
          {!inputData.length==0?<button className='mx-2 my-2 btn btn-outline-danger  px-4' onClick={()=>{setShow3(true);}}>Delete</button>:<label className="px-4 py-2  m-1 bg-white border border-danger round rounded-2 text-danger ">Select to Delete</label>}
          <button className="mx-2 my-2 btn btn-outline-primary px-4 " onClick={() => { setShow(true);}}>Add Record</button>
          <input className="mx-2 my-2 px-2 round rounded-4  " placeholder="&#xf002; Search" style={{ fontFamily: "FontAwesome" }} onChange={search} value={searchData}>
          </input>

        </div >




        <div className="d-flex justify-content-center w-100">
          {console.log(listData)}
          <Table data={data} setData={setData} event={event} setListData={setListData} listData={listData} inputData={inputData} setInputData={setInputData}/>
        </div>
      </div>




    </>
  );
}