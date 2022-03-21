import { useState, useEffect } from "react";
import { useParams } from "react-router";

export function FriendButton() {
    const [friendshipStatus, setFriendshipStatus] = useState(); //"" = no friends, "false", "true"
    const [buttonStatus, setButtonStatus] = useState();

    const { otherUserId } = useParams();

    console.log("otherUserId: ", otherUserId);
    console.log("friendshipStatus: ", friendshipStatus);

    useEffect(() => {
        let abort = false;

        if (!abort) {
            (async () => {
                const data = await fetch(
                    `/api/friendshipstatus/${otherUserId}`
                ).then((resp) => {
                    console.log("i got something back");
                    return resp.json();
                });
                console.log("early data: ", data);
                if (data.success == false) {
                   

                    return () => {
                        abort = true;
                    };
                } else {
                    setFriendshipStatus(data);
                }
            })();
        }
    }, []);

    return (
        <>
            {!friendshipStatus && <button>send friend request</button>}
            
        </>
    );
}
