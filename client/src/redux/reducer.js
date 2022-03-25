import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends/slice.js";
import messagesReducer from "./messages/slice.js";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;
