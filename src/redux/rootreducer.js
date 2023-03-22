import { reducer } from "./reducer";
import {combineReducers} from "redux";


const appReducer = combineReducers({
   reducer

  });
const rootreducer=(state,action)=>{
  
    return appReducer(state, action);
};
export default rootreducer;