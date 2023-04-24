import React from 'react'
import { images } from '../../../Images'
import "./styles.css"

export default function InputFile(props) {
  return (
    <div >
    <input
      type="file"
      style={{ display: "none" }}
      id="fileInput"
      onChange={(e) => {

        if (e.target.value) {

          if (e.target.files[0]?.size > 10000000000) {
            props?.setInvalid(true)
          }
          else {
        document.getElementsByClassName("react-input-emoji--input")?.[0].focus()
            // setFileStatus(true)
            if (e.target.files[0].type === "image/png" || e.target.files[0]?.type === "image/jpeg") {
                props?.setImg(e.target.files[0])
                props?.setImgName(e.target.files[0].name)
                props?.setFileStatus(true)
            }
            else {
              props.setFile(e.target.files[0])
              props?.setFileName(e.target.files[0].name)
              props?.setFileStatus(true)
            }
          }
          e.target.value = null;

        }
      }}
    />
    <label htmlFor="fileInput">
      <img className="messimage" src={images?.attach} alt="" />
    </label>
  </div>
  )
}
