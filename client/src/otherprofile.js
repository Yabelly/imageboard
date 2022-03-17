import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

export function OtherProfile() {
    const [otherUser, setOtherUser] = useState([]);
    // const [error, setError] = useState(false); // can do this later if need be

    const { otherUserId } = useParams();
    const history = useHistory();

    useEffect(() => {
        let abort = false;
        console.log("OtherProfile got rendered");
        console.log("otherUserId: ", otherUserId);

        if (!abort) {
            (async () => {
                const data = await fetch(`/api/otheruser/${otherUserId}`).then(
                    (resp) => {
                        return resp.json();
                    }
                );
                if (data.success == false) {
                    history.push("/");
                }
                console.log("this is data: ", data);
                setOtherUser(data);
            })();
        }
        return () => {
            abort = true;
        };
    }, []);

    console.log("otherUser: ", otherUser);

    return (
        <div>
            <div>
                <div>
                    <h2>
                        {otherUser.first}&nbsp;
                        {otherUser.last}
                    </h2>
                </div>
                <div>
                    <img src={otherUser.profile_pic}></img>
                </div>
                <div>{otherUser.bio}</div>
            </div>
        </div>
    );
}
