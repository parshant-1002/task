import React, { useContext} from 'react'
import { ChatContext } from '../../../Context/ChatContext';
import "./styles.css"
import { STRINGS } from '../../../Shared/Constants';
export default function Modal({ children, show, setEditedGroupName = () => { }, type = "", handleEditGroupName=()=>{}, editedGroupName,  setShow=()=>{}, channelName, title, selectedList, setSelectedList=()=>{}, addChannel=()=>{}, handleAddUsersInChatList = () => { }, addUsersInChannel=()=>{}, showHead, showFoot }) {
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
                            dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
                        }}>
                            Close
                        </button>
                        {selectedList?.length || channelName || editedGroupName ? <button className='btnProceed' onClick={() => {
                            addChannel()
                            data?.groupId && addUsersInChannel()
                            handleAddUsersInChatList()
                            if (channelName?.length < 3 || !isNaN(channelName)) {
                                setShow && setShow(true)
                            }
                            else {
                                setShow && setShow(false)

                            }
                            if (editedGroupName?.length < 3 || !isNaN(editedGroupName)) {
                                setShow && setShow(true)
                            }
                            else {
                                setShow && setShow(false)
                            }
                            handleEditGroupName && handleEditGroupName()
                            dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
                            title === "User" && dispatch({ type: STRINGS.RESET })
                        }} >{type === "editGroupName" ? <>Edit</> : <>Add</>}</button> : null}
                        
                    </div>}
                </div>
            </div>}
        </div>
    )
}
