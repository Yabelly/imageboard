export default function messagesReducer(messages = [], action) {
    console.log("action: ", action);

    if (action.type == "latest-messages/recieved") {
        return (messages = action.payload.chatMessagesHistory);
    } else if (action.type == "new-message/recieved") {
        return (messages = [action.payload.lastMessage, ...messages]);
    }
    return messages;
}

export function recieveLastMessages(chatMessagesHistory) {
    return {
        type: "friends-and-wannabees/received",
        payload: { chatMessagesHistory },
    };
}

export function chatMessageReceived(lastMessage) {
    return {
        type: "new-message/recieved",
        payload: { lastMessage },
    };
}
