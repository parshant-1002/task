import React from 'react'
// import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

export  function Modal1({show,setShow}){
  return (
    <div>
    <Modal show={show} onHide={() => setShow(false)} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
    
       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" >
          Close
        </Button>
        <button className='btn btn-primary my-4' onClick={()=>{setShow(false)}} >Submit</button>

      </Modal.Footer>
    </Modal>

  </div>
  )
}
