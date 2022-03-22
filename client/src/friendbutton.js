import { useState, useEffect } from "react";
import { useParams } from "react-router";

export function FriendButton() {
    const [friendshipStatus, setFriendshipStatus] = useState(1); //1 = no friends, 2 pending, 3 friend

    const { otherUserId } = useParams();

    console.log("friendshipStatus: ", friendshipStatus);

    function handleClick() {
        fetch("/api/postfriendship", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otherUserId, friendshipStatus }),
        })
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                console.log("data: ", data);
                setFriendshipStatus(data.status);
            });
    }

    useEffect(() => {
        let abort = false;

        if (!abort) {
            (async () => {
                const data = await fetch(
                    `/api/friendshipstatus/${otherUserId}`
                ).then((resp) => {
                    return resp.json();
                });
                console.log("data: ", data);
                setFriendshipStatus(data.status);
                return () => {
                    abort = true;
                };
            })();
        }
    }, []);

    if (friendshipStatus == 1) {
        return (
            <>
                <button onClick={handleClick}>send friend request</button>
            </>
        );
    } else if (friendshipStatus == 2) {
        return (
            <>
                <button onClick={handleClick}>accept friend request</button>
            </>
        );
    } else if (friendshipStatus == 3) {
        return (
            <>
                <button onClick={handleClick}>Cancel friendship request</button>
            </>
        );
    } else if (friendshipStatus == 4) {
        return (
            <>
                <button onClick={handleClick}>unfriend</button>
            </>
        );
    }
}
