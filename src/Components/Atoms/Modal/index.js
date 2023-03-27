import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';


export default function Modal1({show,setShow,title,addChannel,children,addUser}){
  return (
    <div>
    <Modal show={show} onHide={() => setShow(false)} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
   
       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setShow(false)}}>
          Close
        </Button>
        <button className='btn btn-primary my-4' onClick={()=>{addChannel&&addChannel() 
        addUser&&addUser()
        setShow(false) }} >Add</button>

      </Modal.Footer>
    </Modal>

  </div>
  )
}
