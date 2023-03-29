import React from 'react'
import "./styles.css"
import cross from "../../../assets/cross.png"
export default function Details({userName,groupName,userImage,members,setDetails,createdBy}) {
    console.log("hi",{userName,groupName,userImage,members})
  return (
    <div className='details'>
        <div className='head'>

        {userImage? <h3 className='headingDetails'> User Details</h3>:<h3 className='headingDetails'> Group Details</h3>}
        <img className='img' src={cross} onClick={()=>{setDetails(false)}}></img>
        </div>
        <div className='detailsHeading'>
        {userImage?<img src={userImage} alt=""></img>:<label>#</label>}
        {userImage?<h4>{userName}</h4>:<h4>{groupName}</h4>}
        </div>
        {!userImage&&<div className='members'>
            <h5>Created By : {createdBy}</h5>
        <h5>Members</h5>
        {members?members?.map(val=><li>{val.name}</li>):null}
        </div>}
        
    </div>
  )
}
