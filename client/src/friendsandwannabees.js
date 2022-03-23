import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    recieveFriends,
    makeFriend,
    deleteFriend,
} from "./redux/friends/slice.js";

export function FriendsAndWannabees() {
    const dispatch = useDispatch();

    const wannabees = useSelector(
        (state) =>
            state.FriendsAndWannabees &&
            state.FriendsAndWannabees.filter(
                (friendship) => !friendship.accepted
            )
    );
    const friends = useSelector(
        (state) =>
            state.FriendsAndWannabees &&
            state.FriendsAndWannabees.filter(
                (friendship) => friendship.accepted
            )
    );
    console.log("state.friends: ", friends);

    console.log("wannabees: ", wannabees);

    useEffect(() => {
        fetch("/api/friends-wannabees")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data all friendsAndWannabees: ", data);
                dispatch(recieveFriends(data));
            }, []);
    });

    const handleAccept = (id) => {
        fetch(`/api/acceptingfriend/${id}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data accepting friend: ", data);
                dispatch(makeFriend(data.id));
            });
    };

    const handleDeny = (id) => {
        fetch(`/api/denyfriend/${id}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data accepting friend: ", data);
                dispatch(deleteFriend(data.id));
            });
    };

    console.log("friends: ", friends);

    return (
        <>
            <div>
                <h1>FriendsAndWannabees</h1>
                {friends.first}
            </div>
        </>
    );
}
