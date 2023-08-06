// libs
import React, { useState } from 'react'

// consts
import { images } from '../../../Images'
import { TEXT } from '../../../Shared/Constants'

// styles
import "./styles.css"
export default function PasswordView({ setPasswordView, passwordView }) {

  const handlePasswordViewType = () => {
    if (passwordView !== TEXT.PASSWORD_VIEW_TYPE.TEXT) {
      setPasswordView(TEXT.PASSWORD_VIEW_TYPE.TEXT)
    } else {
      setPasswordView(TEXT.PASSWORD_VIEW_TYPE.PASSWORD)
    }
  };

  const isShowEyeIcon = passwordView === TEXT.PASSWORD_VIEW_TYPE.TEXT;
  return (
    <div className='passWordViewButton'>
      {isShowEyeIcon ?
        <img
          className="passwordShow"
          src={images.showEye}
          alt=""
          onClick={handlePasswordViewType} />
        :
        <img
          src={images.closeEye}
          className="passwordClose"
          alt=""
          onClick={handlePasswordViewType} />
      }
    </div>
  )
}
