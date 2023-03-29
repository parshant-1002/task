import React, { useContext, useState } from 'react'
import { ChatContext } from '../../../Context/ChatContext';
import "./styles.css"
import "bootstrap/dist/css/bootstrap.min.css";
export default function Modal({ children, show, setShow, title, addChannel, addUser, handleSelect }) {
    // const [state,setState]=useState(false)


    const { data } = useContext(ChatContext);
    return (
        <div>



            {show && <div className='modalData' >


                <div className='modalContent' >
                    <div className="Modal-Header">
                        <label className="Modal-Title">{title}</label>
                    </div>
                    <div className="Modal-Body">
                        {children}
                    </div>
              
                    <div className="Modal-Footer">
                        <button className="btnClose" onClick={() => { setShow(false) }}>
                            Close
                        </button>
                        <button className='btnProceed' onClick={() => {
                            addChannel && addChannel()
                            addUser && data?.groupId && addUser()
                            handleSelect && handleSelect()
                            setShow(false)
                        }} >Add</button>
                    </div>
                </div>


            </div>}
        </div>
    )
}
