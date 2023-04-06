import {
  createContext,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "../AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    channelName: "",
    groupId: "",
    users: [],
    members: [],
    membersAddedStatus: false,
    userData:""
    // allUsers:[]
  };

  const chatReducer = (state, action) => {

    switch (action?.type) {
      case "CHANGE_USER":
        return {
          user: action?.payload,
          channelName: action?.payload?.channelName,
          channelNameId:action?.payload?.channelNameId,
          groupId: action?.payload?.groupId,
          chatId:
            currentUser?.uid > action?.payload?.uid
              ? currentUser?.uid + action.payload?.uid
              : action?.payload?.uid + currentUser?.uid,
        };
      case "GETUSERS":
        return {
          ...state, users: action?.payload
        }
      case "GETGROUPMEMBERS":

        return {

          ...state, members: action?.payload
        }
      case "MEMBERSADDEDSTATUS":

        return {

          ...state, membersAddedStatus: action?.payload
        }
        case "SETUSERDATA":

        return {

          ...state, userData: action?.payload
        }


      case "RESET":
        return {
          user: {},
          channelName: "",
          groupId: "",
          chatId: "null"
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
