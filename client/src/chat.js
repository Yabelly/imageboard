import { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";
export default function Chat() {
    const [textMessage, setTextMessage] = useState("");
    let chat = useSelector((state) => state.messages);
    console.log("chat: ", chat);

    function handleMessage(e) {
        e.preventDefault();
        socket.emit("chatmessage", textMessage);
    }

    function inputUpdate(e) {
        console.log("e.target.value: ", e.target.value);

        setTextMessage(e.target.value);
    }

    return (
        <>
            <div>
                <h1>chatarea</h1>
                <div className="message-area">
                    {chat &&
                        chat.map((msg) => (
                            <div className="chatmessage" key={msg.timestamp}>
                                {msg.message} -by- {msg.first}
                                {msg.last}
                            </div>
                        ))}
                </div>

                <textarea
                    onChange={inputUpdate}
                    type="text"
                    className="chatinput"
                ></textarea>
                <button onClick={handleMessage}>send</button>
            </div>
        </>
    );
}
