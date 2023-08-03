// libs
import React from 'react'

// styles
import "./styles.css"

// components
import ModalFooter from './ModalFooter';

export default function Modal({
    children,
    show,
    setEditedGroupName = () => { },
    type = "",
    handleEditGroupName = () => { },
    editedGroupName,
    setShow = () => { },
    channelName,
    title,
    selectedList,
    setSelectedList = () => { },
    addChannel = () => { },
    handleAddUsersInChatList = () => { },
    addUsersInChannel = () => { },
    showHead,
    showFoot
}) {
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
                    <ModalFooter title={title}
                        type={type}
                        showFoot={showFoot}
                        setShow={setShow}
                        setSelectedList={setSelectedList}
                        setEditedGroupName={setEditedGroupName}
                        channelName={channelName}
                        editedGroupName={editedGroupName}
                        selectedList={selectedList}
                        addChannel={addChannel}
                        addUsersInChannel={addUsersInChannel}
                        handleAddUsersInChatList={handleAddUsersInChatList}
                        handleEditGroupName={handleEditGroupName} />
                </div>
            </div>}
        </div>
    )
}
