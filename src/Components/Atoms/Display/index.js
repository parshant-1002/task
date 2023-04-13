import React, { useContext, useState } from 'react'
import { ChatContext } from '../../../Context/ChatContext';
import "./styles.css"
import "bootstrap/dist/css/bootstrap.min.css";
export default function Display({ children, show, setShow, title, showHead, showFoot ,setImgUrl, setFileUrl,handleSend}) {
    const {dispatch} = useContext(ChatContext);

    return (
        <div>
            {/* header */}
            {show && <div className='channelData' >
                <div className='channelContent' >
                    {showHead && <div className="channel-Header">
                        <label className="channel-Title">{title}</label>
                    </div>}
                    {/* Body */}
                    <div className="channel-Body">
                        {children}
                    </div>
                    {/* Footer */}
                    {showFoot && <div className="channel-Footer">
                        <button className="btnClose" onClick={() => {
                            setShow(false)
                            setImgUrl&&setImgUrl("")
                            setFileUrl&&setFileUrl("")
                            dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
                           
                        }}>
                            Cancel
                        </button  > 
                     
                         <button  className='btnProceed' onClick={
                            ()=>{
                            handleSend()
                         }}>
                            Send
                            </button>  
                    </div>}
                </div>
            </div>}
        </div>
    )
}
