import React, { useState } from 'react'
import { Modal1 } from '../Modal'
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import "./styles.css"
export default function AddChannels() {
    const [show,setShow]=useState(false)
  return (
    <div className='addChannel'>
    <label className='channelLabel'>Add Channels</label>
    <button className='channelButton' onClick={()=>{setShow(true)}} >Add</button>
    <Modal show={show} onHide={() => setShow(false)} >
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
