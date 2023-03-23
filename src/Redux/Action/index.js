import { ActionConstants } from "../AcctionConstants";


export const searchUser=(payload)=>{
   return{
    type:ActionConstants.SEARCH,
    payload
   }
}