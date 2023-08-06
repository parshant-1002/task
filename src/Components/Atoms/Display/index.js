// libs
import React, { useContext, useState } from 'react'

// context
import { ChatContext } from '../../../Context/ChatContext';

// styles
import "./styles.css"
import "bootstrap/dist/css/bootstrap.min.css";

// consts
import { BUTTON_TEXT, STRINGS } from '../../../Shared/Constants';

export default function Display({
    children,
    show,
    setShow,
    title,
    showHead,
    showFoot,
    setImgUrl,
    setFileUrl,
    handleSend
}) {
    const { dispatch } = useContext(ChatContext);

    const handleCancel = () => {
        setShow(false)
        setImgUrl && setImgUrl("")
        setFileUrl && setFileUrl("")
        dispatch(
            {
                type: STRINGS.MEMBERSADDEDSTATUS,
                payload: false
            })
    };

    return (
        <div>
            {/* header */}
            {show && <div className='channelData' >
                <div className='channelContent' >
                    {showHead &&
                        <div className="channel-Header">
                            <label className="channel-Title">{title}</label>
                        </div>}
                    {/* Body */}
                    <div
                        className="channel-Body">
                        {children}
                    </div>
                    {/* Footer */}
                    {showFoot ?
                        <div className="channel-Footer">
                            <button
                                className="btnClose"
                                onClick={handleCancel}
                            >
                                {BUTTON_TEXT.CANCEL}
                            </button>
                            <button
                                className='btnProceed'
                                onClick={handleSend}
                            >
                                {BUTTON_TEXT.SEND}
                            </button>
                        </div>
                        : null}
                </div>
            </div>}
        </div>
    )
}
