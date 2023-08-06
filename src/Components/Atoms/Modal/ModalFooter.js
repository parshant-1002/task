// libs
import React, { useContext } from 'react'

// consts
import { BUTTON_TEXT, STRINGS, TEXT } from '../../../Shared/Constants'

// context
import { ChatContext } from '../../../Context/ChatContext'

export default function ModalFooter({
    title,
    type,
    showFoot,
    setShow,
    setSelectedList,
    setEditedGroupName,
    channelName,
    editedGroupName,
    selectedList,
    addChannel,
    addUsersInChannel,
    handleAddUsersInChatList,
    handleEditGroupName
}) {
    const { data, dispatch } = useContext(ChatContext);
    const handleClose = () => {
        setShow(false)
        setSelectedList([])
        setEditedGroupName("")
        dispatch({
            type: STRINGS.MEMBERSADDEDSTATUS,
            payload: false
        })
    };

    const conditionToCheckValidLength = (name) => {
        if (name?.length < 3 || !isNaN(name)) {
            setShow(true)
        }
        else {
            setShow(false)
        }
    };

    const addOrSendData = () => {
        addChannel();
        handleAddUsersInChatList();
        conditionToCheckValidLength(channelName);
        conditionToCheckValidLength(editedGroupName);
        handleEditGroupName()
        dispatch({
            type: STRINGS.MEMBERSADDEDSTATUS,
            payload: false
        })
        if (title === TEXT.USER) {
            dispatch({
                type: STRINGS.RESET
            })
        }
        if (data?.groupId) {
            addUsersInChannel();
        }
    };

    return (
        <>
            {showFoot &&
                <div className="Modal-Footer">
                    <button
                        className="btnClose"
                        onClick={handleClose}>
                        {BUTTON_TEXT.CLOSE}
                    </button>
                    {(selectedList?.length || channelName || editedGroupName)
                        ? <button
                            className='btnProceed'
                            onClick={addOrSendData}
                        >
                            {(type === TEXT.EDIT_GROUP_NAME)
                                ?
                                <>{BUTTON_TEXT.EDIT}</>
                                :
                                <>{BUTTON_TEXT.ADD}</>
                            }
                        </button>
                        : null}
                </div>}
        </>
    )
}
