import React, { useContext, useState } from 'react'
import { ChatContext } from '../../../Context/ChatContext';
import "./styles.css"
import "bootstrap/dist/css/bootstrap.min.css";
export default function Modal({ children, show, setEditedGroupName,error,setError, editedGroupName, handleGroupNameEdit, setShow, channelName, title, selectedList, setSelectedList, addChannel, addUser, handleSelect, showHead, showFoot }) {
    const { data, dispatch } = useContext(ChatContext);

    return (
        <div>
        
            {/* header */}
            {show && <div className='modalData' >
                <div className='modalContent' >
                    {showHead && <div className="Modal-Header">
                        <label className="Modal-Title">{title}</label>
                    </div>}
                    {/* Body */}
                    <div className="Modal-Body">
                        {children}
                    </div>
                    {/* Footer */}
                    {showFoot && <div className="Modal-Footer">
                        <button className="btnClose" onClick={() => {
                            setShow(false)
                            setSelectedList && setSelectedList([])
                            setEditedGroupName && setEditedGroupName("")
                            dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
                        }}>
                            Close
                        </button>
                        {selectedList?.length || channelName || editedGroupName ? <button className='btnProceed' onClick={() => {
                            addChannel && addChannel()
                            addUser && data?.groupId && addUser()
                            handleSelect && handleSelect()
                          error&&!error&&setShow && setShow(false)
                         
                            handleGroupNameEdit && handleGroupNameEdit()
                            dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
                        }} >Add</button> : null}
                        {console.log( !error,setShow,"999999999999999999999999999999999999999999")}
                    </div>}
                </div>
            </div>}
        </div>
    )
}
