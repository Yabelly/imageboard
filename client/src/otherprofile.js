import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";
import { FriendButton } from "./friendbutton";

export function OtherProfile() {
    const [otherUser, setOtherUser] = useState([]);
    // const [error, setError] = useState(false); // can do this later if need be

    const { otherUserId } = useParams();
    const history = useHistory();
    

    useEffect(() => {
        let abort = false;

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

                setOtherUser(data);
            })();
        }
        return () => {
            abort = true;
        };
    }, []);

    return (
        <div>
            <div className="profile">
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
            <BrowserRouter>
                <Route path="/user/:otherUserId">
                    <FriendButton></FriendButton>
                </Route>
            </BrowserRouter>
        </div>
    );
}
