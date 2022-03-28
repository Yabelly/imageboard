import { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";
export default function Chat() {
    const [textMessage, setTextMessage] = useState("");

    let chat = useSelector((state) => state.messages);

    function handleMessage(e) {
        e.preventDefault();
        socket.emit("chatmessage", textMessage);
        setTextMessage("");
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
                                <img
                                    className="chatpic"
                                    src={msg.profile_pic}
                                ></img>
                                &nbsp; &nbsp;
                                {msg.message} -by-
                                <u>
                                    {msg.first}
                                    {msg.last}
                                </u>
                            </div>
                        ))}
                </div>
                <form>
                    <textarea
                        onChange={(e) => inputUpdate(e)}
                        type="text"
                        className="chatinput"
                        value={textMessage}
                    ></textarea>
                    <button type="reset" onClick={handleMessage}>
                        send
                    </button>
                </form>
            </div>
        </>
    );
}
