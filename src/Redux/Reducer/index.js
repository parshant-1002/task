import { ActionConstants } from "../AcctionConstants"

const initialState={
    searchData:""
}

export const reducer=(state=initialState,action)=>{
    switch(action.type){
        case ActionConstants.SEARCH:
            return {...state,searchData:action.payload}
            
            default:return state
    }
}