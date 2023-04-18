import React, { useContext, useState } from 'react'
import { ChatContext } from '../../../Context/ChatContext';
import "./styles.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { STRINGS } from '../../../Shared/Constants';
export default function Modal({ children, show, setEditedGroupName = ()=>{}, string, type="",handleEditGroupName, editedGroupName, handleGroupNameEdit, setShow, channelName, title, selectedList, setSelectedList, addChannel, addUser=()=>{}, handleSelect=()=>{}, showHead, showFoot }) {
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
                            dispatch({ type:  STRINGS.MEMBERSADDEDSTATUS, payload: false })
                           
                        }}>
                            Close
                        </button>
                        {selectedList?.length || channelName || editedGroupName ? <button className='btnProceed' onClick={() => {
                            addChannel && addChannel()
                            data?.groupId &&  addUser()
                            handleSelect()
                            setShow && setShow(false)
                            handleEditGroupName && handleEditGroupName()
                            handleGroupNameEdit && handleGroupNameEdit()
                            dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
                           title==="User" &&dispatch({ type: STRINGS.RESET })
                        }} >{type=="editGroupName"?<>Edit</>:<>Add</>}</button> : null}
                            {console.log(string==true,string==false,addUser,handleSelect,"addchannel")}

                    </div>}
                </div>
            </div>}
        </div>
    )
}
