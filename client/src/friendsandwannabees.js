import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    recieveFriends,
    makeFriend,
    deleteFriend,
} from "./redux/friends/slice.js";
import { Link } from "react-router-dom";

export function FriendsAndWannabees() {
    const dispatch = useDispatch();

    let wannabees = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friendship) => !friendship.accepted)
    );

    let friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friendship) => friendship.accepted)
    );
    console.log("friends: ", friends);

    useEffect(() => {
        fetch("/api/friends-wannabees")
            .then((resp) => resp.json())
            .then((data) => {
                dispatch(recieveFriends(data));
            });
    }, []);

    function handleAccept(id) {
        console.log("i am running: ");
        fetch(`/api/acceptingfriend/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data accepting friend: ", data);
                dispatch(makeFriend(data.sender_id));
            });
    }

    function handleDeny(id) {
        console.log("i am running: ");

        fetch(`/api/denyfriend/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    dispatch(deleteFriend(id));
                }
            });
    }

    return (
        <>
            <div>
                {wannabees.length == 0 && (
                    <div>
                        <h4>No friend requests available</h4>
                    </div>
                )}
                {wannabees.length > 0 && (
                    <div>
                        <h3>These people want to be friends:</h3>{" "}
                    </div>
                )}
                <div className="grid">
                    {wannabees.map((user) => (
                        <div key={user.id} className="profile">
                            <div className="username">
                                {user.first}&nbsp;
                                {user.last}
                            </div>
                            <Link to={`/user/${user.id}`}>
                                <div className="profile-image">
                                    <img src={user.profile_pic}></img>
                                </div>
                            </Link>
                            <button onClick={() => handleAccept(user.id)}>
                                accept friendship
                            </button>
                        </div>
                    ))}
                </div>
                <h1>Friends</h1>
                {friends.length == 0 && (
                    <div>
                        <h4>No friends available</h4>
                    </div>
                )}
                {friends.length > 0 && (
                    <div>
                        <h4>Your friends:</h4>{" "}
                    </div>
                )}
                <div className="grid">
                    {friends.map((user) => (
                        <div key={user.id} className="profile">
                            <div className="username">
                                {user.first}&nbsp;
                                {user.last}
                            </div>
                            <Link to={`/user/${user.id}`}>
                                <div className="profile-image">
                                    <img src={user.profile_pic}></img>
                                </div>
                            </Link>
                            <button onClick={() => handleDeny(user.id)}>
                                stop friendship
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
