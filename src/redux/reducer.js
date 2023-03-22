import { SENDUSER1, SENDUSER2 } from "./action"

const initialState={
    sender:[],
    receiver:[]
    
}

export const reducer=(state=initialState,action)=>{
    switch(action.type){
        case SENDUSER1:
            return  { ...state, sender: action.state };
    
    case SENDUSER2:
            return  { ...state, receiver: action.state };
    default:
        return state;
}}

