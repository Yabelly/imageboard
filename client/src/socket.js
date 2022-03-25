import {
    recieveLastMessages,
    chatMessageReceived,
} from "./redux/messages/slice.js";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("hello", (msg) => {
            console.log("msg: ", msg);
        });
        socket.on("chatMessages", (msgs) =>
            store.dispatch(recieveLastMessages(msgs))
        );

        socket.on("chatMessage", (msg) =>
            store.dispatch(chatMessageReceived(msg))
        );
        socket.on("chatMessageFromServer", (msg) =>
            store.dispatch(chatMessageReceived(msg))
        );
    }
};
