import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import AddChannels from '../AddChannels';

export default function Modal1({show,setShow,title,channelName,setChannelName,addChannel}){
  return (
    <div>
    <Modal show={show} onHide={() => setShow(false)} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <label>Enter channel name</label>
      <div>
      <input value={channelName} onChange={(e)=>{setChannelName(e.target.value)}}></input>
      </div>

       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setShow(false)}}>
          Close
        </Button>
        <button className='btn btn-primary my-4' onClick={()=>{addChannel() 
        setShow(false) }} >Add</button>

      </Modal.Footer>
    </Modal>

  </div>
  )
}
