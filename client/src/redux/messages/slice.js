export default function messagesReducer(messages = [], action) {
    console.log("action: ", action);

    if (action.type == "latest-messages/recieved") {
        messages = action.payload.chatMessagesHistory;
    } else if (action.type == "new-message/recieved") {
        return [action.payload.lastMessage, ...messages];
    }
    return messages;
}

export function recieveLastMessages(chatMessagesHistory) {
    return {
        type: "latest-messages/recieved",
        payload: { chatMessagesHistory },
    };
}

export function chatMessageReceived(lastMessage) {
    return {
        type: "new-message/recieved",
        payload: { lastMessage },
    };
}
