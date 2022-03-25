export default function friendsWannabeesReducer(friends = [], action) {
    console.log("action: ", action);

    if (action.type == "friends-and-wannabees/received") {
        friends = action.payload.friends;
    } else if (action.type === "friends-and-wannabees/accept") {
        const newFriends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            }
            return friend;
        });
        console.log("newFriends: ", newFriends);

        return newFriends;
    } else if (action.type === "friends-and-wannabees/unfriends") {
        console.log("friends: ", friends);
        console.log("action num: ", action);

        const newFriends = friends.filter(
            (friend) => friend.id != action.payload.id
        );
        console.log("newFriends: ", newFriends);

        return newFriends;
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
