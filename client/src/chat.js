import { recieveLastMessages, newMessage } from "./redux/messages/slice.js";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket.js";
export default function Chat() {
    const [textMessage, setTextMessage] = useState("");

    function handleMessage() {
        socket.emit("chatmessage", textMessage);
    }

    function inputUpdate(e) {
        setTextMessage(e.target.value);
    }
  

    return (
        <>
            <div>
                <h1>chatarea</h1>
                <div className="message-area"></div>
                <form>
                    <input
                        onChange={inputUpdate}
                        type="text"
                        className="chatinput"
                    ></input>
                    <button onClick={handleMessage}>send</button>
                </form>
            </div>
        </>
    );
}
