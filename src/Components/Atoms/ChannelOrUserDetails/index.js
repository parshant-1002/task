import React, { useContext } from 'react'
import "./styles.css"
import deleteIcon from "../../../assets/delete.png"
import cross from "../../../assets/cross.png"
import { ChatContext } from '../../../Context/ChatContext'
export default function Details({userName,groupName,userImage,members,setDetails,createdBy,handleDeleteGroupMembers}) {
  const {data,dispatch}=useContext(ChatContext)
  return (
    <div className='details'>
        <div className='head'>

        {userImage? <h3 className='headingDetails'> User Details</h3>:<h3 className='headingDetails'> Group Details</h3>}
        <img className='img' src={cross} onClick={()=>{setDetails(false)
         dispatch({type:"MEMBERSADDEDSTATUS",payload:true})
        }}></img>
        </div>
        <div className='detailsHeading'>
        {userImage?<img src={userImage} alt=""></img>:<label>#</label>}
        {userImage?<h4>{userName}</h4>:<h4>{groupName}</h4>}
        </div>
        {!userImage&&<div className='members'>
            <h5>Created By : {createdBy}</h5>
        <h5>Members</h5>
        {members?.length?members?.map(val=><div><li>{val.name} <img src={deleteIcon} alt="" onClick={()=>{handleDeleteGroupMembers(val.uid)
       }}></img></li></div>):null}
        </div>}
        
    </div>
  )
}
