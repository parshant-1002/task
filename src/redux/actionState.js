import { SENDUSER1, SENDUSER2 } from "./action"

export const user1=(payload)=>{
    return{

       type:SENDUSER1,
       payload
    }
}

export const user2=(payload)=>{
    return{

       type:SENDUSER2,
       payload
    }
}