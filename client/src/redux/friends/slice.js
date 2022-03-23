export default function friendsWannabeesReducer(friends = [], action) {
    console.log("action: ", action);

    if (action.type == "friends-and-wannabees/received") {
        friends = action.payload.friends;
    } else if (action.type === "friends-and-wannabees/accept") {
        friends = action.map((friends) => {
            if (friends.id === action.payload.id) {
                return {
                    friends,
                };
            }
        });
    } else if (action.type === "friends-and-wannabees/unfriends") {
        //
    }
    return friends;
}

export function recieveFriends(friends) {
    return {
        type: "friends-and-wannabees/received",
        payload: { friends },
    };
}

export function makeFriend(id) {
    return {
        type: "friends-and-wannabees/accept",
        payload: { id },
    };
}

export function deleteFriend(id) {
    return {
        type: "friends-and-wannabees/unfriends",
        payload: { id },
    };
}
