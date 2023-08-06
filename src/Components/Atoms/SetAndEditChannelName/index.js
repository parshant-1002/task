import React from 'react'
import { TEXT } from '../../../Shared/Constants'

export default function SetAndEditChannelName({ setEditModal = () => { }, handleEditGroupName = () => { }, editedGroupName = "", setEditedGroupName = () => { }, setShowChannelModal = () => { }, type, title, addChannel = () => { }, channelName, setChannelName = () => { }, setError = () => { }, error }) {
    const handleKey = (e) => {
        if (e.code === "Enter") {
            addChannel()
            if (channelName?.length > 2 && isNaN(channelName)) {
                setShowChannelModal(false)
            }
        }
    }

    const handleKeyToEditChannelName = (e) => {
        if (e.code === "Enter") {
            handleEditGroupName()
            if (editedGroupName?.length > 2 && isNaN(editedGroupName)) {
                setEditModal(false)
            }
        }
    }

    return (
        <>
            {(type === TEXT.EDIT_CHANNEL_NAME) ?

                <div className="editGroupNameInput">
                    <input
                        value={editedGroupName}
                        onKeyDown={handleKeyToEditChannelName}
                        onChange={(e) => { setEditedGroupName(e.target.value) }}
                    />
                    {error && <label className='error'>{error}</label>}
                </div> :
                <div>
                    <label>Enter {title} name</label>
                    <div>
                        <input
                            value={channelName}
                            onKeyDown={handleKey}
                            onChange={(e) => {
                                setChannelName(e.target.value)
                                setError("")
                            }}></input>
                        {error && <label className='error'>{error}</label>}
                    </div>
                </div>}
        </>
    )
}
