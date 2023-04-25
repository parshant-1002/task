import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "../AuthContext";
import { STRINGS } from "../../Shared/Constants";

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
  };

  const chatReducer = (state, action) => {
    switch (action?.type) { 
      case STRINGS.CHANGE_USER:
        return {
          user: action?.payload,
          channelName: action?.payload?.channelName,
          channelNameId: action?.payload?.channelNameId,
          groupId: action?.payload?.groupId,
          chatId: currentUser?.uid > action?.payload?.uid
            ? currentUser?.uid + action.payload?.uid
            : action?.payload?.uid + currentUser?.uid,
        };
      case STRINGS.GETUSERS:
        return {
          ...state, users: action?.payload
        }
      case STRINGS.GETGROUPMEMBERS:
        return {
          ...state, members: action?.payload
        }
      case STRINGS.MEMBERSADDEDSTATUS:
        return {
          ...state, membersAddedStatus: action?.payload
        }
    
      case STRINGS.RESET:
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
