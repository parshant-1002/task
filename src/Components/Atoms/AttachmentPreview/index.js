import React from 'react'
import "./styles.css"
export default function AttachmentPreview(props) {
  return (
    <div>
      <div>
        {props?.img && <div className="uploadedImage">
          <img className="uploadImg" src={URL.createObjectURL(props?.img)}></img>
          <label>{props?.imgName}</label>
        </div>}
        {props?.file && <div className="uploadedImage">
          <object data={URL.createObjectURL(props?.file)} width="300" height="300" ></object>
          <label>{props?.pdfName}</label>
        </div>}
      </div>
    </div>
  )
}
