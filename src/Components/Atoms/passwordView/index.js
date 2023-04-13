import React, { useState } from 'react'
import { images } from '../../../Images'
import "./styles.css"
export default function PasswordView({setPasswordView}) {
    const [showPassword,setShowPassword]=useState(false)
    console.log(showPassword,"loji")
  return (
    <div className='passWordViewButton'>
        {!showPassword?<img className="passwordShow" src={images.showEye} alt="" onClick={()=>{setShowPassword(true)
    setPasswordView("text")    }
    }></img>:
        <img src={images.closeEye}  className="passwordClose"  alt="" onClick={()=>{setShowPassword(false)
            setPasswordView("password")
        }}></img>}
    </div>
  )
}
