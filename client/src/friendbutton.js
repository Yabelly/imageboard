import { useState, useEffect } from "react";

export function FriendButton() {
    // state stuff
    //useffect
    const [friendship, setFriendship] = useState(""); //"" = no friends, "false", "true"
    const { otherUserId } = useParams();

    useEffect(() => {
        let abort = false;
        console.log("otherUserId: ", otherUserId);
        (async () => {
            const data = await fetch(
                `/api/friendshipstatus/${otherUserId}`
            ).then((resp) => {
                return resp.json();
            });
            console.log("data: ", data);
            setFriendship(data);
        })();

        return () => {
            abort = true;
        };
    });

    return <></>;
}
