import React, { useContext } from 'react'
import { STRINGS } from '../../../Shared/Constants'

import { ChatContext } from '../../../Context/ChatContext'

export default function ModalFooter({ title, type, showFoot, setShow, setSelectedList, setEditedGroupName, channelName, editedGroupName, selectedList, addChannel, addUsersInChannel, handleAddUsersInChatList, handleEditGroupName }) {
    const { data, dispatch } = useContext(ChatContext)
    return (
        <>
            {showFoot && <div className="Modal-Footer">
                <button className="btnClose" onClick={() => {
                    setShow(false)
                    setSelectedList([])
                    setEditedGroupName("")
                    dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
                }}>
                    Close
                </button>
                {selectedList?.length || channelName || editedGroupName ? <button className='btnProceed' onClick={() => {
                    addChannel()
                    data?.groupId && addUsersInChannel()
                    handleAddUsersInChatList()
                    if (channelName?.length < 3 || !isNaN(channelName)) {
                        setShow(true)
                    }
                    else {
                        setShow(false)
                    }
                    if (editedGroupName?.length < 3 || !isNaN(editedGroupName)) {
                        setShow(true)
                    }
                    else {
                        setShow(false)
                    }
                    handleEditGroupName()
                    dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
                    title === "User" && dispatch({ type: STRINGS.RESET })
                }} >{type === "editGroupName" ? <>Edit</> : <>Add</>}</button> : null}

            </div>}
        </>
    )
}
