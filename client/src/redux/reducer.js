import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends/slice.js";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
});

export default rootReducer;
